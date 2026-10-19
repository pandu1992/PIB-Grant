/* PIB 2026 paper — single source of truth.
   All three outputs (on-page HTML, MS Word .doc, IEEE LaTeX .tex) are generated
   from the PAPER object below so they never drift apart.

   Each section provides:
     html : rendered body (MathJax handles $...$ / $$...$$ and \[...\])
     tex  : LaTeX body for the IEEE .tex export
   Shared inline math is written in LaTeX and reused in both where possible.

   NOTE: sections are filled in step by step. Abstract first. */

const META = {
  title: "Forecast-Aware Reinforcement Learning for Inventory Control: When Does Demand Forecasting Help a PPO Policy?",
  authors: "Pandu Dwi Luhur Pambudi",
  affil: "BINUS University, Indonesia",
  keywords: "reinforcement learning, inventory control, demand forecasting, PPO, digital twin, supply chain",
};

/* Sections are added incrementally. Keys render in this order. */
const PAPER = {
  abstract: {
    html: `Inventory control under uncertain demand is a classic sequential
      decision problem, and reinforcement learning (RL) has become a popular
      tool for learning replenishment policies on digital-twin simulators.
      A recurring design question is whether augmenting the agent's state with
      a <em>demand forecast</em> actually improves the learned policy, or whether
      a demand-blind controller already captures most of the attainable value.
      We study this question with a Proximal Policy Optimization (PPO) agent on
      a lead-time inventory environment, comparing policies trained
      <em>with</em> and <em>without</em> a one-step demand forecast across
      multiple demand profiles, two forecasting models (linear regression and a
      random forest), repeated random seeds, and robustness scenarios (noisy
      forecasts and a carbon-aware cost term). We find that, once observations
      are normalized and the reward is shaped as a bounded service level, the
      forecast yields a statistically significant mean advantage of
      $+0.146$ ($\\approx 19\\%$, $t=4.54$). Crucially, the benefit is
      <em>heterogeneous</em> across items (per-item advantage
      $-0.04,\\,+0.29,\\,+0.19$) and the two forecasting models are
      statistically indistinguishable, indicating that forecast
      <em>availability</em> matters far more than forecast model choice. We
      release a fully reproducible pipeline and an interactive in-browser
      digital twin.`,
    tex: `Inventory control under uncertain demand is a classic sequential
decision problem, and reinforcement learning (RL) is increasingly used to learn
replenishment policies on digital-twin simulators. A recurring design question
is whether augmenting the agent's state with a \\emph{demand forecast} improves
the learned policy, or whether a demand-blind controller already captures most
of the attainable value. We study this with a Proximal Policy Optimization (PPO)
agent on a lead-time inventory environment, comparing policies trained
\\emph{with} and \\emph{without} a one-step demand forecast across multiple demand
profiles, two forecasting models (linear regression and a random forest),
repeated seeds, and robustness scenarios (noisy forecasts and a carbon-aware
cost term). Once observations are normalized and the reward is shaped as a
bounded service level, the forecast yields a statistically significant mean
advantage of $+0.146$ ($\\approx 19\\%$, $t=4.54$). The benefit is
\\emph{heterogeneous} across items (per-item advantage $-0.04, +0.29, +0.19$)
and the two forecasting models are statistically indistinguishable, indicating
that forecast \\emph{availability} matters more than forecast model choice. We
release a reproducible pipeline and an interactive in-browser digital twin.`,
  },

  introduction: {
    html: `<p>Replenishment under uncertain demand is one of the oldest problems
      in operations research, and remains central to modern supply chains and
      port logistics, where stock-outs translate directly into lost service and
      overstock into holding and emission costs. Classical inventory theory
      offers elegant closed-form policies&mdash;such as the base-stock and
      $(s,S)$ policies&mdash;but these rely on assumptions (stationary,
      independent demand; known distributions) that rarely hold for the
      intermittent, seasonal, promotion-driven demand seen in practice.</p>

      <p>Reinforcement learning (RL) has emerged as an attractive alternative:
      instead of assuming a demand model, an agent learns a replenishment
      policy directly by interacting with a <em>digital twin</em> of the
      inventory system. Deep RL algorithms such as Proximal Policy Optimization
      (PPO) can, in principle, discover rich state-dependent ordering rules.
      A natural and widely adopted idea is to feed the agent a
      <em>demand forecast</em> as part of its state, on the intuition that
      anticipating future demand should help the agent order ahead of time.</p>

      <p>Yet this intuition is rarely tested in isolation. Most studies bundle a
      forecast into the state and report that the overall system performs well,
      without isolating <em>how much of the gain is attributable to the forecast
      itself</em> versus the RL machinery, the reward design, or the environment
      dynamics. The practical question for a practitioner is sharper: given a
      fixed RL setup, <em>does adding a forecast to the state actually improve
      the learned policy, and by how much&mdash;and is that improvement robust
      across demand profiles, forecast quality, and cost structures?</em></p>

      <p>This paper answers that question through a controlled ablation. We hold
      the RL algorithm (PPO), the environment, and the reward fixed, and toggle a
      single factor: whether a one-step demand forecast is present in the
      observation. We evaluate across (i) multiple demand profiles, (ii) two
      forecasting models of differing capacity (linear regression and a random
      forest), (iii) repeated random seeds, and (iv) robustness scenarios that
      inject forecast noise and add a carbon-aware cost term. Our contributions
      are:</p>
      <ul>
        <li><strong>A clean forecast-ablation protocol</strong> for RL inventory
          control, with normalized observations, a bounded service-level reward,
          and order lead time that makes anticipation necessary.</li>
        <li><strong>Evidence that the forecast helps, but modestly and
          unevenly</strong>: a significant mean advantage of $+0.146$
          ($\\approx 19\\%$, $t=4.54$) that is strongly heterogeneous across
          items.</li>
        <li><strong>The finding that forecast <em>availability</em> dominates
          forecast <em>model choice</em></strong>: linear and random-forest
          forecasters are statistically indistinguishable in downstream reward.</li>
        <li><strong>A fully reproducible, dependency-light pipeline</strong> and
          an interactive in-browser digital twin for inspection and teaching.</li>
      </ul>`,
    tex: `Replenishment under uncertain demand is one of the oldest problems in
operations research and remains central to modern supply chains and port
logistics, where stock-outs translate into lost service and overstock into
holding and emission costs. Classical inventory theory offers elegant
closed-form policies---such as base-stock and $(s,S)$ policies---but these rely
on assumptions (stationary, independent demand; known distributions) that rarely
hold for the intermittent, seasonal, promotion-driven demand seen in practice.

Reinforcement learning (RL) offers an alternative: instead of assuming a demand
model, an agent learns a replenishment policy by interacting with a
\\emph{digital twin} of the inventory system. Deep RL algorithms such as
Proximal Policy Optimization (PPO) can discover rich state-dependent ordering
rules. A widely adopted idea is to feed the agent a \\emph{demand forecast} as
part of its state, on the intuition that anticipating demand helps the agent
order ahead of time.

This intuition is rarely tested in isolation. Most studies bundle a forecast
into the state and report good overall performance without isolating \\emph{how
much of the gain is attributable to the forecast itself} versus the RL
machinery, the reward design, or the environment dynamics. The practical
question is sharper: given a fixed RL setup, \\emph{does adding a forecast to the
state improve the learned policy, by how much, and is the improvement robust
across demand profiles, forecast quality, and cost structures?}

We answer this through a controlled ablation. We hold the RL algorithm (PPO),
the environment, and the reward fixed, and toggle a single factor: whether a
one-step demand forecast is present in the observation. We evaluate across
(i)~multiple demand profiles, (ii)~two forecasting models of differing capacity
(linear regression and a random forest), (iii)~repeated seeds, and
(iv)~robustness scenarios that inject forecast noise and add a carbon-aware cost
term. Our contributions are:
\\begin{itemize}
\\item A clean forecast-ablation protocol for RL inventory control, with
normalized observations, a bounded service-level reward, and an order lead time
that makes anticipation necessary.
\\item Evidence that the forecast helps, but modestly and unevenly: a significant
mean advantage of $+0.146$ ($\\approx 19\\%$, $t=4.54$) that is strongly
heterogeneous across items.
\\item The finding that forecast \\emph{availability} dominates forecast
\\emph{model choice}: linear and random-forest forecasters are statistically
indistinguishable in downstream reward.
\\item A fully reproducible, dependency-light pipeline and an interactive
in-browser digital twin.
\\end{itemize}`,
  },

  related: {
    html: `<p><strong>Classical inventory control.</strong> The theory of
      optimal replenishment is mature. For a single stage with fixed ordering
      cost, the $(s,S)$ policy is optimal, and without a fixed cost the
      base-stock policy is optimal; Clark and Scarf established the optimality of
      base-stock policies in serial multi-echelon systems [6], and Zipkin [7]
      gives a comprehensive treatment. These results are powerful but assume
      known, well-behaved demand distributions&mdash;assumptions that the
      intermittent, seasonal retail demand of the M5 dataset [5] routinely
      violates.</p>

      <p><strong>Reinforcement learning for inventory.</strong> Reinforcement
      learning [1] sidesteps distributional assumptions by learning directly from
      interaction. Oroojlooyjadid et al. [3] applied a deep Q-network to the beer
      game, demonstrating that a learned agent can cope with partners that behave
      irrationally. Gijsbrechts et al. [4] provided a careful benchmark showing
      that deep RL can match or approach strong heuristics on lost-sales,
      dual-sourcing, and multi-echelon problems, while cautioning that tuning and
      compute cost are substantial. Our environment and PPO agent [2] sit in this
      tradition, but our focus is narrower and complementary: rather than
      proposing a new algorithm or beating a heuristic, we isolate the marginal
      value of a single state feature&mdash;the demand forecast.</p>

      <p><strong>Forecasting and the forecasting&ndash;optimization interface.</strong>
      The M5 competition [5] established that machine-learning forecasters
      (notably gradient-boosted trees) are strong on retail demand, yet also that
      forecast accuracy and downstream decision quality are not the same thing.
      This gap motivates a line of work on integrating forecasting with
      optimization. Our study contributes a controlled data point to that
      interface: we vary forecast <em>availability</em> and forecast
      <em>model</em> independently and measure the effect on a learned control
      policy, rather than on a forecast-accuracy metric. The finding that
      forecaster choice (linear vs.\\ random forest) is statistically
      indistinguishable downstream, while forecast presence is not, is a concrete
      illustration of this accuracy&ndash;decision distinction.</p>`,
    tex: `\\textbf{Classical inventory control.} The theory of optimal
replenishment is mature. For a single stage with a fixed ordering cost the
$(s,S)$ policy is optimal, and without a fixed cost the base-stock policy is
optimal; Clark and Scarf established the optimality of base-stock policies in
serial multi-echelon systems~\\cite{clark1960}, and Zipkin~\\cite{zipkin2000}
gives a comprehensive treatment. These results assume known, well-behaved demand
distributions---assumptions that the intermittent, seasonal retail demand of the
M5 dataset~\\cite{makridakis2022m5} routinely violates.

\\textbf{Reinforcement learning for inventory.} Reinforcement
learning~\\cite{sutton2018} sidesteps distributional assumptions by learning
from interaction. Oroojlooyjadid et al.~\\cite{oroojlooy2022beer} applied a deep
Q-network to the beer game, showing a learned agent can cope with partners that
behave irrationally. Gijsbrechts et al.~\\cite{gijsbrechts2022} benchmarked deep
RL on lost-sales, dual-sourcing, and multi-echelon problems, showing it can
match strong heuristics while cautioning that tuning and compute cost are
substantial. Our PPO agent~\\cite{schulman2017ppo} sits in this tradition, but
our focus is complementary: rather than proposing a new algorithm, we isolate
the marginal value of a single state feature---the demand forecast.

\\textbf{The forecasting--optimization interface.} The M5
competition~\\cite{makridakis2022m5} established that machine-learning
forecasters are strong on retail demand, yet also that forecast accuracy and
downstream decision quality differ. Our study contributes a controlled data
point to this interface: we vary forecast \\emph{availability} and forecast
\\emph{model} independently and measure the effect on a learned control policy
rather than on a forecast-accuracy metric. That forecaster choice (linear vs.\\
random forest) is statistically indistinguishable downstream, while forecast
presence is not, concretely illustrates this accuracy--decision distinction.`,
  },
  // method, results, conclusion added next...
};

/* IEEE references (numbered). Order here = citation number used in the text. */
const REFERENCES = [
  "R. S. Sutton and A. G. Barto, \\emph{Reinforcement Learning: An Introduction}, 2nd ed. Cambridge, MA, USA: MIT Press, 2018.",
  "J. Schulman, F. Wolski, P. Dhariwal, A. Radford, and O. Klimov, ``Proximal policy optimization algorithms,'' \\emph{arXiv:1707.06347}, 2017.",
  "A. Oroojlooyjadid, M. Nazari, L. V. Snyder, and M. Tak\\'{a}\\v{c}, ``A deep Q-network for the beer game: Deep reinforcement learning for inventory optimization,'' \\emph{Manuf. Serv. Oper. Manag.}, vol. 24, no. 1, pp. 285--304, 2022.",
  "J. Gijsbrechts, R. N. Boute, J. A. Van Mieghem, and D. J. Zhang, ``Can deep reinforcement learning improve inventory management? Performance on lost sales, dual-sourcing, and multi-echelon problems,'' \\emph{Manuf. Serv. Oper. Manag.}, vol. 24, no. 3, pp. 1349--1368, 2022.",
  "S. Makridakis, E. Spiliotis, and V. Assimakopoulos, ``The M5 accuracy competition: Results, findings, and conclusions,'' \\emph{Int. J. Forecast.}, vol. 38, no. 4, pp. 1346--1364, 2022.",
  "A. J. Clark and H. Scarf, ``Optimal policies for a multi-echelon inventory problem,'' \\emph{Manag. Sci.}, vol. 6, no. 4, pp. 475--490, 1960.",
  "P. H. Zipkin, \\emph{Foundations of Inventory Management}. New York, NY, USA: McGraw-Hill, 2000.",
];
/* LaTeX \\bibitem keys, in the SAME order as REFERENCES (1..n). */
const REF_KEYS = [
  "sutton2018", "schulman2017ppo", "oroojlooy2022beer",
  "gijsbrechts2022", "makridakis2022m5", "clark1960", "zipkin2000",
];
/* Plain-text (no \\emph) reference strings for the on-page / Word reference list. */
function refPlain(r) {
  return r.replace(/\\emph\{([^}]*)\}/g, "$1").replace(/``|''/g, '"')
          .replace(/--/g, "\u2013").replace(/\\'\{([a-z])\}/gi, "$1").replace(/\\v\{([a-z])\}/gi, "$1");
}

/* ---------- order + display titles ---------- */
const SECTION_ORDER = [
  ["abstract", "Abstract"],
  ["introduction", "Introduction"],
  ["related", "Related Work"],
  // ["method", "Methodology"],
  // ["results", "Results and Discussion"],
  // ["conclusion", "Conclusion"],
];

/* ===================== on-page rendering ===================== */
function renderPage() {
  const root = document.getElementById("paperBody");
  let html = `<h1 class="ptitle">${META.title}</h1>
    <p class="pauthors">${META.authors}<br><span class="paffil">${META.affil}</span></p>`;
  for (const [key, title] of SECTION_ORDER) {
    const sec = PAPER[key];
    if (!sec) continue;
    if (key === "abstract") {
      html += `<p class="pabstract"><strong><em>Abstract—</em></strong> ${sec.html}</p>
        <p class="pkeywords"><strong><em>Index Terms—</em></strong> ${META.keywords}.</p>`;
    } else {
      html += `<h2 class="psec">${title}</h2>${sec.html}`;
    }
  }
  if (REFERENCES && REFERENCES.length) {
    html += `<h2 class="psec">References</h2><ol class="prefs">` +
      REFERENCES.map(r => `<li>${refPlain(r)}</li>`).join("") + `</ol>`;
  }
  root.innerHTML = html;
  if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([root]);
}

/* Convert inline LaTeX-ish math to readable plain text for the Word fallback.
   (Word opens the HTML wrapper natively; we only need the symbols legible.) */
function mathToText(s) {
  return s
    .replace(/\$([^$]+)\$/g, "$1")   // drop $...$ delimiters
    .replace(/\\approx/g, "\u2248")
    .replace(/\\times/g, "\u00d7")
    .replace(/\\pm/g, "\u00b1")
    .replace(/\\le(?:q)?/g, "\u2264")
    .replace(/\\ge(?:q)?/g, "\u2265")
    .replace(/\\cdot/g, "\u00b7")
    .replace(/\\,/g, "\u2009")       // thin space
    .replace(/\\%/g, "%")
    .replace(/\\emph\{([^}]*)\}/g, "<i>$1</i>")
    .replace(/\\text(?:bf|it|rm)?\{([^}]*)\}/g, "$1");
}

/* ===================== MS Word (.doc) export ===================== */
function buildWord() {
  let body = `<h1 style="text-align:center;font-size:14pt;">${META.title}</h1>
    <p style="text-align:center;">${META.authors}<br><i>${META.affil}</i></p>`;
  for (const [key, title] of SECTION_ORDER) {
    const sec = PAPER[key];
    if (!sec) continue;
    // strip inline $...$ delimiters + common LaTeX macros for Word (plain-text math fallback)
    const txt = mathToText(sec.html);
    if (key === "abstract") {
      body += `<p><b><i>Abstract—</i></b> ${txt}</p><p><b><i>Index Terms—</i></b> ${META.keywords}.</p>`;
    } else {
      body += `<h2 style="font-size:11pt;">${title}</h2>${txt}`;
    }
  }
  if (REFERENCES && REFERENCES.length) {
    body += `<h2 style="font-size:11pt;">References</h2><ol>` +
      REFERENCES.map(r => `<li>${refPlain(r)}</li>`).join("") + `</ol>`;
  }
  return `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office'
xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${META.title}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>body{font-family:'Times New Roman',serif;font-size:10pt;line-height:1.3;}
table{border-collapse:collapse;}td,th{border:1px solid #000;padding:3px;}</style>
</head><body>${body}</body></html>`;
}

/* ===================== IEEE LaTeX (.tex) export ===================== */
function buildIEEE() {
  let s = `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
\\usepackage{cite,amsmath,amssymb,amsfonts,algorithmic,graphicx,textcomp,xcolor,booktabs}
\\begin{document}
\\title{${META.title}}
\\author{\\IEEEauthorblockN{${META.authors}}
\\IEEEauthorblockA{\\textit{${META.affil}}}}
\\maketitle
`;
  for (const [key, title] of SECTION_ORDER) {
    const sec = PAPER[key];
    if (!sec) continue;
    if (key === "abstract") {
      s += `\\begin{abstract}\n${sec.tex}\n\\end{abstract}\n`;
      s += `\\begin{IEEEkeywords}\n${META.keywords}\n\\end{IEEEkeywords}\n`;
    } else {
      s += `\\section{${title}}\n${sec.tex}\n`;
    }
  }
  if (REFERENCES && REFERENCES.length) {
    s += `\\begin{thebibliography}{00}\n`;
    REFERENCES.forEach((r, i) => { s += `\\bibitem{${REF_KEYS[i]}} ${r}\n`; });
    s += `\\end{thebibliography}\n`;
  }
  s += `\\end{document}\n`;
  return s;
}

/* ===================== download helpers ===================== */
function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a);
  a.click(); a.remove(); URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", () => {
  renderPage();
  document.getElementById("btnWord").addEventListener("click", () =>
    download("PIB2026_paper.doc", buildWord(), "application/msword"));
  document.getElementById("btnTex").addEventListener("click", () =>
    download("PIB2026_IEEE.tex", buildIEEE(), "application/x-tex"));
});
