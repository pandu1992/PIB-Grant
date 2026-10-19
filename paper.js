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
  // related, method, results, conclusion added next...
};

/* ---------- order + display titles ---------- */
const SECTION_ORDER = [
  ["abstract", "Abstract"],
  ["introduction", "Introduction"],
  // ["related", "Related Work"],
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
