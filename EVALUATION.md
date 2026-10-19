# PIB 2026 — Evaluation of the Forecast-aware RL Inventory Model

Reproducible local pipeline: `pib_rl_local.py` (refactored from `NEW_PIB_2026.ipynb`).
Data: real M5 `sales_train_validation.csv` if present, else a reproducible
synthetic demand generator (used for the numbers below).

## TL;DR

After the **design fixes**, the central hypothesis of the notebook — *"a demand
forecast helps the RL inventory agent"* — is now **supported with a strong,
statistically significant signal**, whereas in the original design it was not.

| Metric | v1 (original design) | v2 (improved design) |
|---|---|---|
| Reward scale | ~ **−10** (always negative) | **0.75–0.90** (service level, 0–1) |
| Forecast advantage (reward_FC − reward_base) | +0.080 | **+0.146** |
| Advantage relative to reward | ~0.8% | **~19%** |
| Runs where forecast helped | 50% (coin-flip) | **56%**, driven by large wins |
| t-stat vs 0 | 2.34 (fragile) | **4.54** (robust) |

## What changed in the design and why it mattered

1. **Lead time on orders** — orders now arrive `lead_time` days later, so the
   agent *must anticipate* future demand. This is what makes a forecast
   genuinely useful; with zero lead time (v1) the agent could just react to
   demand after observing it, so forecast ≈ no-forecast.
2. **Normalised observations** (divided by a per-item demand scale) — PPO now
   trains stably; v1's unnormalised, growing state values prevented convergence
   (hence the permanently negative rewards).
3. **Service-level reward shaping** — reward = fill-rate − normalised holding
   (− carbon) ∈ roughly [0,1], making rewards bounded, positive, and comparable
   across items.
4. **Forecast caching** — forecasts are precomputed per episode, making the
   RandomForest forecaster ~12× faster (104s → 6s per run) so the full grid is
   practical.

## Is it "interesting" and "robust"? — honest read

**Interesting: yes.** The result is no longer a null result. The forecast buys a
~19% higher service-level reward on average, and the advantage **persists under
the robustness scenarios** (noisy forecast, carbon penalty: +0.15 / +0.15 /
+0.14 respectively — forecast value is not destroyed by noise or the carbon
term).

**Robust but heterogeneous.** The per-item breakdown is the most honest finding:

| item | mean adv | note |
|---|---|---|
| 0 | **−0.04** | forecast slightly *hurts* — baseline already near-optimal |
| 1 | **+0.29** | large, consistent gain |
| 2 | **+0.19** | large gain, but high variance across seeds |

So the forecast is valuable **on average**, but **not uniformly** — on some
demand profiles the no-forecast baseline is already good enough, and on others
the benefit is seed-sensitive. The two forecast models (Linear vs RandomForest)
are **statistically indistinguishable** here (MAE 0.99 vs 1.00; near-identical
rewards), i.e. forecast *availability* matters far more than forecast *model
choice* on this data.

## Caveats / next steps

- Numbers above are on **synthetic** demand (M5 CSV not available in this
  environment). Re-run with the real M5 file to confirm; the pipeline will pick
  it up automatically if placed in the repo root or `data/`.
- PPO is trained for only 6–7k timesteps per run for speed; longer training and
  more seeds would tighten the per-item variance (especially item 2).
- Evaluation is in-sample on each item's full series; a train/test split on the
  time axis for the RL rollout would make the claim stronger.
