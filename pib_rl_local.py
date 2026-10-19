"""
PIB 2026 - Predictive-Forecast + Reinforcement Learning for Inventory Control
=============================================================================

Local, reproducible refactor of NEW_PIB_2026.ipynb  (DESIGN-IMPROVED, v2).

What changed vs the original Colab notebook
-------------------------------------------
1. Removed Colab-only dependencies (`!pip install`, `google.colab.drive`).
2. Dynamic data loading: looks for the M5 `sales_train_validation.csv` in a few
   common locations; if it is not found, falls back to a *reproducible synthetic
   demand generator* so the pipeline runs anywhere with no external data.
3. De-duplicated the three near-identical notebook cells into a single set of
   reusable functions / environments.
4. Bug fix: `plt.boxplot(..., labels=...)` -> `tick_labels=` (deprecated in
   Matplotlib >= 3.9) with a backwards-compatible fallback.
5. Experiment expansion: multiple items, two forecast models (Linear vs RF),
   and robustness scenarios (noisy forecast, carbon-aware).

DESIGN IMPROVEMENTS (v2) - why the v1 signal was weak
-----------------------------------------------------
In v1 the forecast gave ~0 advantage and every reward was negative, because:
  * observations were unnormalised (PPO struggled to converge), and
  * with zero lead time the agent could react to demand *after* seeing it, so
    a forecast was not actually needed.
v2 fixes the environment design so the "forecast vs no-forecast" question is
meaningful and the agent can actually learn:
  (a) LEAD TIME: orders arrive `lead_time` days later, so the agent MUST
      anticipate future demand -> forecast information becomes genuinely useful.
  (b) NORMALISED observations (divided by a demand scale) -> stable PPO training.
  (c) SERVICE-LEVEL reward shaping (fill-rate minus normalised holding/shortage)
      so rewards are bounded, comparable across items, and can be positive.

Run:  python pib_rl_local.py --quick     (fast smoke run)
      python pib_rl_local.py             (default config)
"""

from __future__ import annotations

import argparse
import os
import warnings
from collections import deque
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

import gymnasium as gym
from gymnasium import spaces
from stable_baselines3 import PPO


# =============================================================================
# 1. DATA LOADING  (dynamic path + synthetic fallback)
# =============================================================================
CANDIDATE_PATHS = [
    "sales_train_validation.csv",
    "data/sales_train_validation.csv",
    "PIB 2026/sales_train_validation.csv",
    os.path.expanduser("~/PIB 2026/sales_train_validation.csv"),
    "/content/drive/MyDrive/PIB 2026/sales_train_validation.csv",  # original Colab path
]


def find_m5_csv() -> str | None:
    for p in CANDIDATE_PATHS:
        if Path(p).is_file():
            return p
    return None


def make_synthetic_sales(n_items: int = 10, n_days: int = 1200, seed: int = 0) -> pd.DataFrame:
    """Reproducible synthetic demand resembling M5 structure (id + d_1..d_T).

    Demand is strongly seasonal (weekly + yearly) so that *anticipating* future
    demand - which is what a forecast enables - is valuable under lead time.
    """
    rng = np.random.default_rng(seed)
    rows = []
    t = np.arange(n_days)
    for i in range(n_items):
        base = rng.uniform(8, 20)                                   # item base level
        weekly = rng.uniform(3, 7) * np.sin(2 * np.pi * t / 7 + rng.uniform(0, 6.28))
        yearly = rng.uniform(2, 6) * np.sin(2 * np.pi * t / 365 + rng.uniform(0, 6.28))
        trend = rng.uniform(-0.002, 0.004) * t
        noise = rng.normal(0, 1.0, n_days)
        demand = np.clip(base + weekly + yearly + trend + noise, 0, None)
        rows.append(np.round(demand).astype(int))
    df = pd.DataFrame(rows, columns=[f"d_{j+1}" for j in range(n_days)])
    df.insert(0, "id", [f"ITEM_{k}" for k in range(n_items)])
    return df


def load_sales(n_items: int, seed: int = 0) -> tuple[pd.DataFrame, str]:
    path = find_m5_csv()
    if path:
        print(f"[data] Loaded real M5 data from: {path}")
        return pd.read_csv(path), "m5"
    print("[data] M5 CSV not found -> using reproducible SYNTHETIC demand.")
    return make_synthetic_sales(n_items=max(n_items, 10), seed=seed), "synthetic"


def item_series(sales: pd.DataFrame, idx: int) -> np.ndarray:
    demand_cols = [c for c in sales.columns if c.startswith("d_")]
    return sales.iloc[idx][demand_cols].astype(float).values


# =============================================================================
# 2. FORECAST MODELS
# =============================================================================
def create_lag(series: np.ndarray, lag: int = 7):
    X, y = [], []
    for i in range(lag, len(series)):
        X.append(series[i - lag:i])
        y.append(series[i])
    return np.array(X), np.array(y)


def build_forecaster(name: str):
    if name == "linear":
        return LinearRegression()
    if name == "rf":
        return RandomForestRegressor(n_estimators=60, max_depth=8, random_state=0, n_jobs=-1)
    raise ValueError(f"unknown forecaster: {name}")


def fit_forecaster(series: np.ndarray, name: str, lag: int = 7):
    X, y = create_lag(series, lag)
    split = int(0.8 * len(X))
    model = build_forecaster(name)
    model.fit(X[:split], y[:split])
    mae = mean_absolute_error(y[split:], model.predict(X[split:])) if split < len(X) else float("nan")
    return model, mae


# =============================================================================
# 3. RL ENVIRONMENT (single unified definition, DESIGN-IMPROVED)
# =============================================================================
class InventoryEnv(gym.Env):
    """Digital-twin inventory environment with lead time + normalised obs.

    Dynamics
    --------
    * Each step the agent chooses an order quantity in [0, max_order].
    * Orders arrive after `lead_time` days (a pipeline / order queue), so the
      agent must plan ahead -> a demand forecast is genuinely useful.
    * Observation is normalised by `demand_scale` for stable PPO training:
        use_forecast=True  -> [inventory, pipeline, backlog, forecast] / scale
        use_forecast=False -> [inventory, pipeline, backlog]           / scale
    * Reward is a SERVICE-LEVEL shaped signal (bounded, can be positive):
        reward = fill_rate - holding_penalty - carbon_penalty
      where fill_rate = sales / demand in [0, 1].
    """

    def __init__(self, demand, model=None, lag=7, use_forecast=True,
                 forecast_noise=0.0, carbon=False, lead_time=2,
                 holding_cost=0.05, max_order_mult=3.0):
        super().__init__()
        self.demand = np.asarray(demand, dtype=np.float64)
        self.model = model
        self.lag = lag
        self.use_forecast = use_forecast
        self.forecast_noise = forecast_noise
        self.carbon = carbon
        self.lead_time = int(lead_time)
        self.holding_cost = holding_cost

        # Scale everything by typical demand so observations/actions are O(1).
        self.demand_scale = max(1.0, float(np.mean(self.demand)))
        self.max_order = max_order_mult * self.demand_scale

        obs_dim = 4 if use_forecast else 3
        self.action_space = spaces.Box(low=0.0, high=1.0, shape=(1,), dtype=np.float32)
        self.observation_space = spaces.Box(low=-10.0, high=50.0, shape=(obs_dim,), dtype=np.float32)

        # Precompute forecasts ONCE (deterministic in t) so slow models like
        # RandomForest are not re-queried on every env step -> big speedup.
        self._forecast_cache = None
        if self.use_forecast and self.model is not None:
            idx = np.arange(self.lag, len(self.demand))
            X = np.stack([self.demand[i - self.lag:i] for i in idx])
            preds = self.model.predict(X)
            self._forecast_cache = np.zeros(len(self.demand), dtype=np.float64)
            self._forecast_cache[idx] = preds

    # -- helpers ------------------------------------------------------------
    def _forecast(self):
        base = float(self._forecast_cache[self.t])
        if self.forecast_noise:
            base += float(np.random.normal(0, self.forecast_noise * self.demand_scale / 10.0))
        return base

    def _get_state(self):
        pipeline = float(sum(self.order_queue))
        s = [self.inventory, pipeline, self.backlog]
        if self.use_forecast:
            s.append(self._forecast())
        return (np.array(s, dtype=np.float32) / self.demand_scale)

    # -- gym API ------------------------------------------------------------
    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.t = self.lag
        self.inventory = self.demand_scale            # start with ~1 day of stock
        self.backlog = 0.0
        self.order_queue = deque([0.0] * self.lead_time, maxlen=self.lead_time)
        return self._get_state(), {}

    def step(self, action):
        # action in [0,1] -> order quantity in [0, max_order]
        order = float(np.clip(action[0], 0.0, 1.0)) * self.max_order

        # 1) receive the order that was placed `lead_time` days ago
        arriving = self.order_queue.popleft() if self.order_queue else 0.0
        self.order_queue.append(order)
        self.inventory += arriving

        # 2) meet demand (plus any backlog carried over)
        demand = self.demand[self.t]
        required = demand + self.backlog
        sales = min(self.inventory, required)
        self.inventory -= sales
        unmet = max(0.0, required - sales)
        self.backlog = unmet

        # 3) service-level shaped reward (bounded, comparable across items)
        fill_rate = sales / required if required > 0 else 1.0
        holding_pen = self.holding_cost * (self.inventory / self.demand_scale)
        reward = fill_rate - holding_pen
        if self.carbon:
            reward -= 0.02 * (order / self.demand_scale)

        self.t += 1
        done = self.t >= len(self.demand) - 1
        return self._get_state(), float(reward), done, False, {}


# =============================================================================
# 4. TRAIN + EVALUATE
# =============================================================================
def evaluate_policy(env, model, steps=300):
    obs, _ = env.reset()
    rewards, fills = [], []
    for _ in range(steps):
        action, _ = model.predict(obs, deterministic=True)
        obs, r, done, _, _ = env.step(action)
        rewards.append(r)
        if done:
            break
    return float(np.mean(rewards))


def run_experiment(series, forecaster="linear", forecast_noise=0.0,
                   carbon=False, seed=0, timesteps=15000, lag=7, lead_time=2):
    np.random.seed(seed)
    model_fc, mae = fit_forecaster(series, forecaster, lag)

    env_fc = InventoryEnv(series, model_fc, lag, use_forecast=True,
                          forecast_noise=forecast_noise, carbon=carbon, lead_time=lead_time)
    env_no = InventoryEnv(series, None, lag, use_forecast=False,
                          carbon=carbon, lead_time=lead_time)

    ppo_fc = PPO("MlpPolicy", env_fc, verbose=0, seed=seed)
    ppo_fc.learn(total_timesteps=timesteps)

    ppo_no = PPO("MlpPolicy", env_no, verbose=0, seed=seed)
    ppo_no.learn(total_timesteps=timesteps)

    return evaluate_policy(env_fc, ppo_fc), evaluate_policy(env_no, ppo_no), mae


# =============================================================================
# 5. MAIN EXPERIMENT GRID
# =============================================================================
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--quick", action="store_true", help="fast smoke run")
    ap.add_argument("--items", type=int, default=5)
    ap.add_argument("--seeds", type=int, default=3)
    ap.add_argument("--timesteps", type=int, default=12000)
    ap.add_argument("--lead-time", type=int, default=2)
    ap.add_argument("--out", type=str, default="pib_rl_results.csv")
    args = ap.parse_args()

    if args.quick:
        args.items, args.seeds, args.timesteps = 2, 2, 6000

    sales, source = load_sales(n_items=args.items)
    n_items = min(args.items, len(sales))
    forecasters = ["linear", "rf"]

    records = []
    for item in range(n_items):
        series = item_series(sales, item)
        for fc in forecasters:
            for seed in range(args.seeds):
                scenarios = {
                    "base":   dict(forecast_noise=0.0, carbon=False),
                    "badfc":  dict(forecast_noise=1.5, carbon=False),
                    "carbon": dict(forecast_noise=0.0, carbon=True),
                }
                for scen, kw in scenarios.items():
                    r_fc, r_no, mae = run_experiment(
                        series, forecaster=fc, seed=seed,
                        timesteps=args.timesteps, lead_time=args.lead_time, **kw)
                    records.append(dict(
                        item=item, forecaster=fc, scenario=scen, seed=seed,
                        reward_forecast=r_fc, reward_baseline=r_no,
                        advantage=r_fc - r_no, forecast_mae=mae))
                    print(f"item={item} fc={fc:6s} scen={scen:6s} seed={seed} "
                          f"| FC={r_fc:6.3f}  NoFC={r_no:6.3f}  adv={r_fc-r_no:+6.3f}  mae={mae:.3f}")

    df = pd.DataFrame(records)
    df.to_csv(args.out, index=False)
    print(f"\n[saved] {args.out}  ({len(df)} rows, data source: {source})")

    # ---- Summary ------------------------------------------------------------
    print("\n================= SUMMARY (mean +/- std of reward) =================")
    summary = (df.groupby(["forecaster", "scenario"])
                 [["reward_forecast", "reward_baseline", "advantage"]]
                 .agg(["mean", "std"]))
    pd.set_option("display.width", 140)
    print(summary.round(3))

    adv = df["advantage"]
    import math
    t = adv.mean() / (adv.std(ddof=1) / math.sqrt(len(adv))) if adv.std(ddof=1) > 0 else float("nan")
    print(f"\nOVERALL forecast advantage: mean={adv.mean():+.3f}  "
          f"std={adv.std():.3f}  helped={100*(adv>0).mean():.0f}% of runs  t={t:.2f}")
    print("\nForecast model quality (MAE, lower=better):")
    print(df.groupby("forecaster")["forecast_mae"].mean().round(3))

    # ---- Visualization (bug-fixed boxplot) ---------------------------------
    fig, ax = plt.subplots(figsize=(11, 5))
    groups, labels = [], []
    for fc in forecasters:
        for scen in ["base", "badfc", "carbon"]:
            groups.append(df[(df.forecaster == fc) & (df.scenario == scen)]["advantage"].values)
            labels.append(f"{fc}\n{scen}")
    try:
        ax.boxplot(groups, tick_labels=labels)   # Matplotlib >= 3.9
    except TypeError:
        ax.boxplot(groups, labels=labels)        # older Matplotlib
    ax.axhline(0, color="red", ls="--", lw=1, label="no advantage")
    ax.set_title("Forecast advantage (reward_FC - reward_baseline) by model x scenario")
    ax.set_ylabel("advantage")
    ax.legend()
    fig.tight_layout()
    fig.savefig("pib_rl_advantage.png", dpi=110)
    print("\n[saved] pib_rl_advantage.png")


if __name__ == "__main__":
    main()
