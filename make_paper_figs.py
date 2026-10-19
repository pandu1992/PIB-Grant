"""Generate publication-quality result figures for the paper from the real CSV.

Outputs (committed to the repo so the LaTeX .tex compiles with \\includegraphics):
  fig_advantage.png  - mean forecast advantage by forecaster x scenario
  fig_peritem.png    - per-item advantage with +/- 1 SD error bars
"""
import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

os.environ.setdefault("MPLCONFIGDIR", "/tmp/mpl")
# Prefer the real-M5 results file if present; otherwise the generic one.
_here = os.path.dirname(__file__)
_m5 = os.path.join(_here, "pib_rl_results_m5.csv")
_csv = _m5 if os.path.isfile(_m5) else os.path.join(_here, "pib_rl_results.csv")
df = pd.read_csv(_csv)
print(f"[figs] using {os.path.basename(_csv)}")

plt.rcParams.update({
    "font.family": "serif", "font.size": 11,
    "figure.dpi": 130, "savefig.bbox": "tight",
})

# ---- Fig. 2: mean advantage by forecaster x scenario ----
forecasters, scenarios = ["linear", "rf"], ["base", "badfc", "carbon"]
labels, means, sds = [], [], []
for fc in forecasters:
    for sc in scenarios:
        sub = df[(df.forecaster == fc) & (df.scenario == sc)]["advantage"]
        labels.append(f"{fc}\n{sc}")
        means.append(sub.mean())
        sds.append(sub.std())

fig, ax = plt.subplots(figsize=(7.2, 3.3))
x = np.arange(len(labels))
colors = ["#3b6fb0" if l.startswith("linear") else "#d9822b" for l in labels]
ax.bar(x, means, yerr=sds, capsize=3, color=colors, edgecolor="#1b2b45", linewidth=0.6)
ax.axhline(0, color="#c0392b", ls="--", lw=1)
ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=9)
ax.set_ylabel(r"mean advantage $\Delta$")
ax.set_title("Forecast advantage by forecaster and scenario (real M5)")
ax.margins(y=0.15)
fig.savefig(os.path.join(os.path.dirname(__file__), "fig_advantage.png"))
plt.close(fig)

# ---- Fig. 3: per-item advantage with error bars ----
agg = {"advantage": ["mean", "std"]}
if "item_id" in df.columns:
    agg["item_id"] = "first"
g = df.groupby("item").agg(mean=("advantage", "mean"),
                           std=("advantage", "std")).reset_index()
# short readable labels: use M5 category prefix when available, else item index
if "item_id" in df.columns:
    ids = df.groupby("item")["item_id"].first().reindex(g["item"]).values
    def short(s):
        p = str(s).split("_")
        return (p[0][:4].title() + "\n" + "_".join(p[1:3])) if len(p) >= 3 else str(s)
    labels = [short(s) for s in ids]
else:
    labels = [f"item {i}" for i in g["item"]]

fig, ax = plt.subplots(figsize=(7.0, 3.4))
xi = np.arange(len(g))
bar_colors = ["#c0392b" if m < 0 else "#2e7d4f" for m in g["mean"]]
ax.bar(xi, g["mean"], yerr=g["std"], capsize=4, color=bar_colors,
       edgecolor="#1b2b45", linewidth=0.6)
ax.axhline(0, color="#555", ls="--", lw=1)
ax.set_xticks(xi); ax.set_xticklabels(labels, fontsize=8)
ax.set_ylabel(r"advantage $\Delta$ (mean $\pm$ 1 SD)")
ax.set_title("Per-item forecast advantage (real M5 items)")
fig.savefig(os.path.join(os.path.dirname(__file__), "fig_peritem.png"))
plt.close(fig)

print("wrote fig_advantage.png and fig_peritem.png")
