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
  authors: "Pandu",                       // TODO: confirm author name(s)
  affil: "BINUS University, Indonesia",    // TODO: confirm affiliation
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
      $+0.146$ (${"\u2248"}19\\%, $t=4.54$). Crucially, the benefit is
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
  // introduction, related, method, results, conclusion added next...
};

/* ---------- order + display titles ---------- */
const SECTION_ORDER = [
  ["abstract", "Abstract"],
  // ["introduction", "Introduction"],
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

/* ===================== MS Word (.doc) export ===================== */
function buildWord() {
  let body = `<h1 style="text-align:center;font-size:14pt;">${META.title}</h1>
    <p style="text-align:center;">${META.authors}<br><i>${META.affil}</i></p>`;
  for (const [key, title] of SECTION_ORDER) {
    const sec = PAPER[key];
    if (!sec) continue;
    // strip inline $...$ delimiters for Word (plain text math fallback)
    const txt = sec.html.replace(/\$([^$]+)\$/g, "$1").replace(/\\%/g, "%").replace(/\\approx/g, "≈");
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
