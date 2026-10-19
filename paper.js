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
      optimal replenishment is mature. The economic order quantity dates to
      Harris [17]; for stochastic demand, Arrow, Karlin and Scarf [16] laid the
      mathematical foundations, and Scarf [19] proved the optimality of the
      $(s,S)$ policy under a fixed ordering cost, while the base-stock policy is
      optimal without one. Clark and Scarf [6] established base-stock optimality
      in serial multi-echelon systems; Zipkin [7] and Nahmias [18] give
      comprehensive treatments. These results are powerful but assume known,
      well-behaved demand distributions&mdash;assumptions that the intermittent,
      seasonal retail demand of the M5 [5] and M4 [24] datasets routinely
      violate.</p>

      <p><strong>Reinforcement learning for inventory.</strong> Reinforcement
      learning [1], built on temporal-difference learning [21], was transformed
      by the deep Q-network [8] and by stable policy-gradient methods&mdash;trust
      region policy optimization [22], generalized advantage estimation [23],
      and PPO [2]. In inventory control, Oroojlooyjadid et al. [3] applied a deep
      Q-network to the beer game; Gijsbrechts et al. [4] benchmarked deep RL on
      lost-sales, dual-sourcing, and multi-echelon problems, cautioning that
      tuning and compute cost are substantial; and Boute et al. [15] survey the
      design space in a practitioner roadmap. Our environment and PPO agent [2]
      sit in this tradition, but our focus is narrower and complementary: rather
      than proposing a new algorithm or beating a heuristic, we isolate the
      marginal value of a single state feature&mdash;the demand forecast.</p>

      <p><strong>Forecasting and the forecasting&ndash;optimization interface.</strong>
      The M5 competition [5] established that machine-learning forecasters are
      strong on retail demand, yet also that forecast accuracy and downstream
      decision quality are not the same thing. A complementary line integrates
      the two steps end-to-end: Oroojlooyjadid et al. [13] applied deep learning
      directly to the newsvendor problem, and Qi et al. [14] proposed a practical
      end-to-end deep model mapping features to replenishment decisions; deep
      sequence models such as the LSTM [25] underpin many such forecasters. Our
      study contributes a controlled data point to this interface: we vary
      forecast <em>availability</em> and forecast <em>model</em> independently and
      measure the effect on a learned control policy, rather than on a
      forecast-accuracy metric. The finding that forecaster choice (linear vs.\\
      random forest [9]) is statistically indistinguishable downstream, while
      forecast presence is not, concretely illustrates this
      accuracy&ndash;decision distinction.</p>`,
    tex: `\\textbf{Classical inventory control.} The theory of optimal
replenishment is mature. The economic order quantity dates to
Harris~\\cite{harris1913}; for stochastic demand, Arrow, Karlin and
Scarf~\\cite{arrow1958} laid the foundations, and Scarf~\\cite{scarf1960ss} proved
the optimality of the $(s,S)$ policy under a fixed ordering cost, while the
base-stock policy is optimal without one. Clark and Scarf~\\cite{clark1960}
established base-stock optimality in serial multi-echelon systems;
Zipkin~\\cite{zipkin2000} and Nahmias~\\cite{nahmias2015} give comprehensive
treatments. These results assume known, well-behaved demand
distributions---assumptions that the intermittent, seasonal retail demand of the
M5~\\cite{makridakis2022m5} and M4~\\cite{makridakis2020m4} datasets routinely
violate.

\\textbf{Reinforcement learning for inventory.} Reinforcement
learning~\\cite{sutton2018}, built on temporal-difference
learning~\\cite{sutton1988td}, was transformed by the deep
Q-network~\\cite{mnih2015} and by stable policy-gradient methods---trust region
policy optimization~\\cite{schulman2015trpo}, generalized advantage
estimation~\\cite{schulman2016gae}, and PPO~\\cite{schulman2017ppo}. In inventory
control, Oroojlooyjadid et al.~\\cite{oroojlooy2022beer} applied a deep Q-network
to the beer game; Gijsbrechts et al.~\\cite{gijsbrechts2022} benchmarked deep RL
on lost-sales, dual-sourcing, and multi-echelon problems, cautioning that tuning
and compute cost are substantial; and Boute et al.~\\cite{boute2022roadmap}
survey the design space. Our PPO agent sits in this tradition, but our focus is
complementary: rather than proposing a new algorithm, we isolate the marginal
value of a single state feature---the demand forecast.

\\textbf{The forecasting--optimization interface.} The M5
competition~\\cite{makridakis2022m5} established that machine-learning
forecasters are strong on retail demand, yet also that forecast accuracy and
downstream decision quality differ. A complementary line integrates the two
steps end-to-end: Oroojlooyjadid et al.~\\cite{oroojlooy2020newsvendor} applied
deep learning to the newsvendor problem, and Qi et al.~\\cite{qi2023} proposed a
practical end-to-end deep model; deep sequence models such as the
LSTM~\\cite{hochreiter1997lstm} underpin many such forecasters. Our study
contributes a controlled data point to this interface: we vary forecast
\\emph{availability} and forecast \\emph{model} independently and measure the
effect on a learned control policy
rather than on a forecast-accuracy metric. That forecaster choice (linear vs.\\
random forest) is statistically indistinguishable downstream, while forecast
presence is not, concretely illustrates this accuracy--decision distinction.`,
  },

  method: {
    html: `<h3 class="psub">A. Problem as a Markov Decision Process</h3>
      <p>We model single-item replenishment as a discrete-time Markov Decision
      Process (MDP) $(\\mathcal{S}, \\mathcal{A}, P, r, \\gamma)$. At day $t$ the
      agent observes a state $s_t$, chooses an order quantity $a_t$, receives a
      reward $r_t$, and transitions to $s_{t+1}$. The agent maximizes the
      expected discounted return $\\mathbb{E}\\!\\left[\\sum_{t} \\gamma^{t}
      r_t\\right]$ with discount $\\gamma \\in (0,1]$. MDPs have long been used to
      cast sequential business decisions as learnable control problems [20].</p>

      <h3 class="psub">B. Demand and the forecaster</h3>
      <p>Let $d_t \\ge 0$ be demand on day $t$. The forecaster
      $\\hat f_\\theta$ predicts next-day demand from the previous $L$ days
      (lag window $L=7$):</p>
      $$\\hat d_t \\;=\\; \\hat f_\\theta\\big(d_{t-L}, d_{t-L+1}, \\dots, d_{t-1}\\big).$$
      <p>We instantiate $\\hat f_\\theta$ as either ordinary least squares
      (linear regression) or a random forest, fit on the first 80% of each
      series. Forecast quality is summarized by the mean absolute error
      $\\mathrm{MAE} = \\frac{1}{N}\\sum_t \\lvert \\hat d_t - d_t \\rvert$ on the
      held-out tail.</p>

      <h3 class="psub">C. Inventory environment with lead time</h3>
      <p>Orders are not received instantly: an order placed on day $t$ arrives
      $\\ell$ days later (lead time $\\ell$). We track on-hand inventory $I_t$, a
      pipeline of in-transit orders $q_{t-\\ell+1}, \\dots, q_t$, and unmet
      backlog $B_t$. The one-step dynamics are</p>
      $$I_t' = I_t + q_{t-\\ell}, \\qquad
        \\mathrm{sales}_t = \\min\\!\\big(I_t',\\, d_t + B_t\\big),$$
      $$I_{t+1} = I_t' - \\mathrm{sales}_t, \\qquad
        B_{t+1} = \\big(d_t + B_t - \\mathrm{sales}_t\\big)^{+},$$
      <p>where $(x)^{+} = \\max(0,x)$. Because the order placed today only
      affects inventory $\\ell$ days from now, the agent must <em>anticipate</em>
      future demand&mdash;this is precisely what makes a forecast potentially
      useful, and is the key design change over a zero-lead-time environment.</p>

      <p><strong>Observation and action.</strong> All quantities are normalized
      by a per-item demand scale $\\bar d = \\max(1, \\tfrac1T\\sum_t d_t)$ for
      stable learning. With forecast, the observation is</p>
      $$s_t^{\\text{fc}} = \\tfrac{1}{\\bar d}\\big(I_t,\\; \\textstyle\\sum_i q_{t-i},\\; B_t,\\; \\hat d_t\\big),$$
      <p>and the demand-blind baseline simply drops the last component,
      $s_t^{\\text{base}} = \\tfrac{1}{\\bar d}(I_t, \\sum_i q_{t-i}, B_t)$. The
      action $a_t \\in [0,1]$ is scaled to an order
      $q_t = a_t \\cdot 3\\bar d$.</p>

      <h3 class="psub">D. Service-level reward</h3>
      <p>Rather than an unbounded cost, we shape a bounded reward around the
      achieved <em>fill rate</em>, penalizing holding and (optionally) carbon:</p>
      $$r_t = \\underbrace{\\frac{\\mathrm{sales}_t}{d_t + B_t}}_{\\text{fill rate}\\,\\in[0,1]}
        \\;-\\; c_h\\,\\frac{I_{t+1}}{\\bar d}
        \\;-\\; \\mathbb{1}[\\text{carbon}]\\, c_e\\,\\frac{q_t}{\\bar d},$$
      <p>with holding weight $c_h = 0.05$ and emission weight $c_e = 0.02$. This
      keeps rewards comparable across items and, unlike the original design,
      bounded and typically positive.</p>

      <h3 class="psub">E. Policy optimization (PPO)</h3>
      <p>We train a PPO agent, which maximizes the clipped surrogate objective</p>
      $$L^{\\text{CLIP}}(\\phi) = \\mathbb{E}_t\\!\\left[
        \\min\\!\\big(\\rho_t(\\phi)\\hat A_t,\\;
        \\mathrm{clip}(\\rho_t(\\phi), 1-\\epsilon, 1+\\epsilon)\\,\\hat A_t\\big)\\right],
        \\quad \\rho_t(\\phi) = \\frac{\\pi_\\phi(a_t\\mid s_t)}{\\pi_{\\phi_{\\text{old}}}(a_t\\mid s_t)},$$
      <p>where $\\hat A_t$ is the advantage estimate and $\\epsilon$ the clip
      range. The only difference between the two agents is the observation
      ($s^{\\text{fc}}$ vs.\\ $s^{\\text{base}}$); network, optimizer, and budget
      are identical.</p>

      <div class="figbox">
        <svg viewBox="0 0 760 150" width="100%" role="img" aria-label="Environment loop diagram">
          <defs><marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#22406e"/></marker></defs>
          <g font-family="Georgia, serif" font-size="13" fill="#10203a" text-anchor="middle">
            <rect x="20"  y="50" width="140" height="50" rx="8" fill="#eaf1fb" stroke="#22406e"/><text x="90"  y="80">Forecaster</text>
            <rect x="220" y="50" width="150" height="50" rx="8" fill="#eaf1fb" stroke="#22406e"/><text x="295" y="80">PPO policy</text>
            <rect x="430" y="50" width="170" height="50" rx="8" fill="#eaf1fb" stroke="#22406e"/><text x="515" y="73">Inventory twin</text><text x="515" y="90">(lead time)</text>
            <line x1="160" y1="75" x2="218" y2="75" stroke="#22406e" marker-end="url(#ar)"/>
            <line x1="370" y1="75" x2="428" y2="75" stroke="#22406e" marker-end="url(#ar)"/>
            <text x="400" y="42">order</text>
            <text x="190" y="42">forecast</text>
            <path d="M515,100 L515,130 L90,130 L90,100" fill="none" stroke="#22406e" marker-end="url(#ar)"/>
            <text x="300" y="146">next state and reward</text>
          </g>
        </svg>
        <p class="figcap">Fig. 1. The closed loop: the forecaster feeds $\\hat d_t$ into
          the PPO policy, which orders $q_t$; the inventory twin applies lead-time
          dynamics and returns the next state and reward.</p>
      </div>`,
    tex: `\\subsection{Problem as a Markov Decision Process}
We model single-item replenishment as a discrete-time Markov Decision Process
(MDP) $(\\mathcal{S},\\mathcal{A},P,r,\\gamma)$. At day $t$ the agent observes a
state $s_t$, chooses an order $a_t$, receives reward $r_t$, and transitions to
$s_{t+1}$, maximizing $\\mathbb{E}[\\sum_t \\gamma^t r_t]$ with
$\\gamma\\in(0,1]$. MDPs are a standard lens for sequential business
decisions~\\cite{shani2005mdp}.

\\subsection{Demand and the forecaster}
Let $d_t\\ge 0$ be demand on day $t$. The forecaster $\\hat f_\\theta$ predicts
next-day demand from the previous $L$ days ($L=7$):
\\begin{equation}
\\hat d_t = \\hat f_\\theta(d_{t-L},d_{t-L+1},\\dots,d_{t-1}).
\\end{equation}
We use ordinary least squares or a random forest, fit on the first $80\\%$ of
each series, and report $\\mathrm{MAE}=\\frac{1}{N}\\sum_t|\\hat d_t-d_t|$ on the
held-out tail.

\\subsection{Inventory environment with lead time}
An order placed on day $t$ arrives $\\ell$ days later. With on-hand inventory
$I_t$, in-transit pipeline $q_{t-\\ell+1},\\dots,q_t$, and backlog $B_t$:
\\begin{align}
I_t' &= I_t + q_{t-\\ell}, &
\\mathrm{sales}_t &= \\min(I_t',\\, d_t+B_t),\\\\
I_{t+1} &= I_t' - \\mathrm{sales}_t, &
B_{t+1} &= (d_t+B_t-\\mathrm{sales}_t)^{+},
\\end{align}
where $(x)^{+}=\\max(0,x)$. Because today's order only affects inventory $\\ell$
days hence, the agent must \\emph{anticipate} demand---precisely what makes a
forecast useful, and the key change over a zero-lead-time environment.

All quantities are normalized by a per-item scale
$\\bar d=\\max(1,\\frac1T\\sum_t d_t)$. With forecast,
$s_t^{\\mathrm{fc}}=\\frac{1}{\\bar d}(I_t,\\sum_i q_{t-i},B_t,\\hat d_t)$; the
baseline drops the last component. The action $a_t\\in[0,1]$ scales to
$q_t=a_t\\cdot 3\\bar d$.

\\subsection{Service-level reward}
\\begin{equation}
r_t = \\frac{\\mathrm{sales}_t}{d_t+B_t}
      - c_h\\frac{I_{t+1}}{\\bar d}
      - \\mathbb{1}[\\mathrm{carbon}]\\,c_e\\frac{q_t}{\\bar d},
\\end{equation}
with $c_h=0.05$, $c_e=0.02$. The fill-rate term lies in $[0,1]$, keeping rewards
bounded, comparable across items, and typically positive.

\\subsection{Policy optimization (PPO)}
We train a PPO agent maximizing the clipped surrogate
\\begin{equation}
L^{\\mathrm{CLIP}}(\\phi)=\\mathbb{E}_t\\big[\\min(\\rho_t\\hat A_t,\\,
\\mathrm{clip}(\\rho_t,1-\\epsilon,1+\\epsilon)\\hat A_t)\\big],\\;
\\rho_t=\\frac{\\pi_\\phi(a_t\\mid s_t)}{\\pi_{\\phi_{\\mathrm{old}}}(a_t\\mid s_t)}.
\\end{equation}
The sole difference between the two agents is the observation
($s^{\\mathrm{fc}}$ vs.\\ $s^{\\mathrm{base}}$); network, optimizer, and budget
are identical.

\\begin{figure}[t]\\centering
\\fbox{\\parbox{0.9\\linewidth}{\\centering Forecaster $\\hat f_\\theta$
$\\rightarrow$ PPO policy $\\pi_\\phi(a_t\\mid s_t)$ $\\rightarrow$ Inventory twin
(lead time $\\ell$) $\\rightarrow$ state $s_{t+1}$, reward $r_t$ (loop).}}
\\caption{The closed loop: the forecaster feeds $\\hat d_t$ to the PPO policy,
which orders $q_t$; the twin applies lead-time dynamics and returns the next
state and reward.}
\\label{fig:loop}
\\end{figure}`,
  },

  results: {
    html: `<h3 class="psub">A. Experimental setup</h3>
      <p><strong>Data collection and provenance.</strong> We are explicit about
      where the demand data comes from, because it bounds the interpretation of
      every number below. Our pipeline supports <em>two</em> sources, selected
      automatically at run time:</p>
      <ul>
        <li><strong>Real data (optional).</strong> If the M5 competition file
          <code>sales_train_validation.csv</code> [5] is present on disk, the
          pipeline loads it directly. M5 contains 42,840 daily Walmart unit-sales
          series; each item's row of <code>d_1 \\dots d_T</code> columns becomes
          one demand series. No such file is distributed with this study, and the
          sandbox used for the reported runs did <em>not</em> contain it.</li>
        <li><strong>Synthetic data (used here).</strong> When the M5 file is
          absent, the pipeline falls back to a <em>reproducible synthetic
          generator</em> seeded by a fixed integer, so every run is bit-for-bit
          repeatable. <strong>All numbers reported in this paper come from this
          synthetic generator</strong>, not from real retail data; we state this
          plainly to avoid overclaiming.</li>
      </ul>
      <p>Each synthetic series of length $T$ (here $T\\approx 1000$ days) for item
      $i$ is generated as</p>
      $$d_t^{(i)} = \\big\\lfloor \\max(0,\\; b_i + A^w_i\\sin(\\tfrac{2\\pi t}{7}+\\varphi^w_i)
        + A^y_i\\sin(\\tfrac{2\\pi t}{365}+\\varphi^y_i) + \\kappa_i t + \\varepsilon_t)\\big\\rceil,$$
      <p>with a base level $b_i$, weekly and yearly seasonal amplitudes
      $A^w_i, A^y_i$ and phases $\\varphi^w_i,\\varphi^y_i$, a small linear trend
      $\\kappa_i$, and Gaussian noise $\\varepsilon_t\\sim\\mathcal{N}(0,\\sigma^2)$;
      all drawn from fixed ranges by the seeded generator. The weekly and yearly
      terms are deliberately strong so that <em>anticipation</em> is rewarded,
      making this a fair&mdash;if idealized&mdash;testbed for the forecast
      question. We emphasize that synthetic demand is a controlled stand-in; the
      intermittent, promotion-driven structure of real M5 series [5], [23] is
      only partially captured, and confirming the findings on M5 is immediate
      future work (Section&nbsp;V).</p>

      <p><strong>Protocol.</strong> For each item we train both agents
      (with/without forecast) using each forecaster&mdash;ordinary least squares
      and a random forest [9]&mdash;under three scenarios: a <em>base</em>
      scenario, a <em>noisy-forecast</em> scenario (Gaussian perturbation of
      $\\hat d_t$), and a <em>carbon-aware</em> scenario (emission penalty
      active). Each configuration is repeated over random seeds. Forecasters are
      implemented with scikit-learn [10] and the PPO agent [2] with
      Stable-Baselines3 [11] on the Gymnasium interface [12]. The primary metric
      is the mean per-step reward; the quantity of interest is the
      <em>advantage</em> $\\Delta = \\bar r_{\\text{fc}} - \\bar r_{\\text{base}}$.</p>

      <h3 class="psub">B. Does the forecast help?</h3>
      <p>Table I reports mean rewards. Across all configurations the forecast
      produces a positive mean advantage of $+0.146$ (standard deviation
      $0.19$), which is $\\approx 19\\%$ of the baseline reward and statistically
      significant against the null of no effect ($t = 4.54$). The advantage
      survives both robustness scenarios: it is essentially unchanged under
      forecast noise ($+0.15$) and under the carbon penalty ($+0.14$),
      indicating the benefit is not an artifact of a particular cost structure
      or of noiseless forecasts.</p>

      <table class="metrics ptab">
        <caption>TABLE I. Mean reward (service level), forecast vs. baseline, by forecaster and scenario (synthetic demand).</caption>
        <tr><th>Forecaster</th><th>Scenario</th><th>Reward (fc)</th><th>Reward (base)</th><th>Advantage $\\Delta$</th></tr>
        <tr><td>Linear</td><td>base</td><td>0.901</td><td>0.753</td><td>+0.148</td></tr>
        <tr><td>Linear</td><td>noisy fc</td><td>0.905</td><td>0.753</td><td>+0.152</td></tr>
        <tr><td>Linear</td><td>carbon</td><td>0.883</td><td>0.740</td><td>+0.143</td></tr>
        <tr><td>Random forest</td><td>base</td><td>0.895</td><td>0.754</td><td>+0.141</td></tr>
        <tr><td>Random forest</td><td>noisy fc</td><td>0.908</td><td>0.753</td><td>+0.155</td></tr>
        <tr><td>Random forest</td><td>carbon</td><td>0.876</td><td>0.741</td><td>+0.135</td></tr>
      </table>

      <h3 class="psub">C. The benefit is heterogeneous</h3>
      <p>The aggregate hides substantial per-item variation (Table II). On one
      profile the forecast slightly <em>hurts</em> ($\\Delta = -0.04$), because a
      demand-blind base-stock-like policy is already near-optimal there; on
      others it helps markedly ($+0.29$, $+0.19$). This heterogeneity is the most
      practically important finding: the value of a forecast depends on the
      demand profile, and a blanket "always add a forecast" recommendation is not
      warranted.</p>

      <table class="metrics ptab">
        <caption>TABLE II. Per-item forecast advantage (mean over seeds and scenarios).</caption>
        <tr><th>Item</th><th>Mean $\\Delta$</th><th>Std</th><th>Min</th><th>Max</th></tr>
        <tr><td>0</td><td>&minus;0.04</td><td>0.01</td><td>&minus;0.06</td><td>&minus;0.03</td></tr>
        <tr><td>1</td><td>+0.29</td><td>0.06</td><td>+0.23</td><td>+0.36</td></tr>
        <tr><td>2</td><td>+0.19</td><td>0.23</td><td>&minus;0.07</td><td>+0.41</td></tr>
      </table>

      <h3 class="psub">D. Availability versus model choice</h3>
      <p>The two forecasters are statistically indistinguishable in both forecast
      accuracy (MAE $0.99$ for linear vs.\\ $1.00$ for the random forest) and in
      the downstream reward they induce. In other words, having <em>a</em>
      forecast in the state is what matters; the additional capacity of a random
      forest buys nothing here. For practitioners this is encouraging&mdash;a
      cheap linear forecaster suffices&mdash;and it cautions against assuming that
      a more accurate forecaster will automatically yield better control.</p>

      <h3 class="psub">E. Discussion and limitations</h3>
      <p>Three caveats bound these claims. First, the headline numbers use
      synthetic demand; the pipeline reads real M5 data automatically when
      present, and reproducing the study there is immediate future work. Second,
      PPO is trained on a modest step budget for tractability, which inflates
      seed variance (visible for item 2); longer training would tighten the
      estimates. Third, evaluation is in-sample along each item's series; a
      temporal train/test split for the rollout would strengthen external
      validity. None of these undermines the central, repeated pattern: the
      forecast helps on average, unevenly across items, and its <em>presence</em>
      matters more than its <em>model</em>.</p>`,
    tex: `\\subsection{Data collection and provenance}
We are explicit about data provenance, as it bounds every result below. The
pipeline supports two sources, selected automatically at run time.
\\emph{Real data (optional):} if the M5 competition file
\\texttt{sales\\_train\\_validation.csv}~\\cite{makridakis2022m5} is present, it is
loaded directly; M5 contains 42{,}840 daily Walmart unit-sales series, and each
item's $d_1\\dots d_T$ row becomes one demand series. No such file is distributed
with this study, and the sandbox used for the reported runs did not contain it.
\\emph{Synthetic data (used here):} when the M5 file is absent, the pipeline
falls back to a reproducible synthetic generator seeded by a fixed integer.
\\textbf{All numbers reported in this paper come from this synthetic generator},
not from real retail data. Each series of length $T\\approx 1000$ for item $i$ is
\\begin{equation}
d_t^{(i)}=\\Big\\lfloor\\max\\big(0,\\, b_i + A^w_i\\sin(\\tfrac{2\\pi t}{7}+\\varphi^w_i)
+ A^y_i\\sin(\\tfrac{2\\pi t}{365}+\\varphi^y_i) + \\kappa_i t + \\varepsilon_t\\big)\\Big\\rceil,
\\end{equation}
with base level $b_i$, seasonal amplitudes/phases $A^w_i,A^y_i,\\varphi^w_i,
\\varphi^y_i$, trend $\\kappa_i$, and noise
$\\varepsilon_t\\sim\\mathcal{N}(0,\\sigma^2)$, all drawn from fixed ranges by the
seeded generator. The seasonal terms are deliberately strong so anticipation is
rewarded. Synthetic demand is a controlled stand-in; the intermittent,
promotion-driven structure of real M5 series~\\cite{makridakis2022m5,
makridakis2020m4} is only partially captured, and confirming the findings on M5
is immediate future work (Section~\\ref{sec:conclusion}).

\\subsection{Protocol}
For each item we train both agents (with/without forecast) using each
forecaster---ordinary least squares and a random forest~\\cite{breiman2001}---under
three scenarios: \\emph{base}, \\emph{noisy-forecast} (Gaussian perturbation of
$\\hat d_t$), and \\emph{carbon-aware} (emission penalty). Each configuration is
repeated over seeds. Forecasters use scikit-learn~\\cite{pedregosa2011}; the PPO
agent~\\cite{schulman2017ppo} uses Stable-Baselines3~\\cite{raffin2021sb3} on the
Gymnasium interface~\\cite{towers2024gym}. The primary metric is mean per-step
reward; the quantity of interest is the advantage
$\\Delta=\\bar r_{\\mathrm{fc}}-\\bar r_{\\mathrm{base}}$.

\\subsection{Does the forecast help?}
Table~\\ref{tab:main} reports mean rewards. Across all configurations the
forecast yields a positive mean advantage of $+0.146$ (s.d.\\ $0.19$),
$\\approx 19\\%$ of the baseline reward and significant against the null of no
effect ($t=4.54$). The advantage survives both robustness scenarios: essentially
unchanged under forecast noise ($+0.15$) and the carbon penalty ($+0.14$).

\\begin{table}[t]\\centering
\\caption{Mean reward (service level), forecast vs.\\ baseline, by forecaster and
scenario (synthetic demand).}\\label{tab:main}
\\begin{tabular}{llccc}
\\toprule
Forecaster & Scenario & Reward (fc) & Reward (base) & Advantage $\\Delta$\\\\
\\midrule
Linear & base     & 0.901 & 0.753 & $+0.148$\\\\
Linear & noisy fc & 0.905 & 0.753 & $+0.152$\\\\
Linear & carbon   & 0.883 & 0.740 & $+0.143$\\\\
Random forest & base     & 0.895 & 0.754 & $+0.141$\\\\
Random forest & noisy fc & 0.908 & 0.753 & $+0.155$\\\\
Random forest & carbon   & 0.876 & 0.741 & $+0.135$\\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{The benefit is heterogeneous}
The aggregate hides substantial per-item variation (Table~\\ref{tab:item}). On
one profile the forecast slightly \\emph{hurts} ($\\Delta=-0.04$), because a
demand-blind policy is already near-optimal there; on others it helps markedly
($+0.29$, $+0.19$). This heterogeneity is the most practically important finding:
the value of a forecast depends on the demand profile, so a blanket \`\`always add
a forecast'' recommendation is not warranted.

\\begin{table}[t]\\centering
\\caption{Per-item forecast advantage (mean over seeds and scenarios).}
\\label{tab:item}
\\begin{tabular}{lcccc}
\\toprule
Item & Mean $\\Delta$ & Std & Min & Max\\\\
\\midrule
0 & $-0.04$ & 0.01 & $-0.06$ & $-0.03$\\\\
1 & $+0.29$ & 0.06 & $+0.23$ & $+0.36$\\\\
2 & $+0.19$ & 0.23 & $-0.07$ & $+0.41$\\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{Availability versus model choice}
The two forecasters are statistically indistinguishable in both accuracy
(MAE $0.99$ vs.\\ $1.00$) and in the downstream reward they induce. Having
\\emph{a} forecast in the state is what matters; the extra capacity of a random
forest buys nothing here. A cheap linear forecaster suffices, and one should not
assume a more accurate forecaster automatically yields better control.

\\subsection{Discussion and limitations}
Three caveats bound these claims. First, the headline numbers use synthetic
demand; the pipeline reads real M5 data automatically when present, and
reproducing the study there is immediate future work. Second, PPO is trained on a
modest step budget, inflating seed variance (visible for item~2). Third,
evaluation is in-sample along each item's series; a temporal train/test split
would strengthen external validity. None of these undermines the central
pattern: the forecast helps on average, unevenly across items, and its
\\emph{presence} matters more than its \\emph{model}.`,
  },

  conclusion: {
    html: `<p>We asked a deliberately narrow question&mdash;does adding a demand
      forecast to the state improve a PPO inventory policy, and by how
      much?&mdash;and answered it with a controlled ablation holding the
      algorithm, environment, and reward fixed. With normalized observations, a
      bounded service-level reward, and an order lead time that makes
      anticipation necessary, the forecast delivers a small but statistically
      significant mean advantage ($+0.146$, $\\approx 19\\%$, $t=4.54$). Two
      qualifications matter as much as the headline: the benefit is
      <em>heterogeneous</em> across demand profiles, and forecast
      <em>availability</em> dominates forecast <em>model choice</em>. We release a
      reproducible, dependency-light pipeline and an interactive in-browser
      digital twin so that the result can be inspected and extended.</p>
      <p><strong>Future work.</strong> Three directions follow directly. First,
      <em>real data</em>: re-running the identical pipeline on the M5 series [5]
      will test whether the synthetic-demand findings transfer to intermittent,
      promotion-driven retail demand. Second, <em>richer settings</em>:
      extending from a single stage to dual-sourcing and multi-echelon systems
      [4], where the value of anticipation&mdash;and therefore of a
      forecast&mdash;may be larger. Third, <em>end-to-end and probabilistic
      forecasting</em>: coupling the forecaster and the policy more tightly, as in
      end-to-end newsvendor and inventory models [13], [14], and exposing the
      agent to forecast <em>uncertainty</em> rather than a point estimate. We
      conjecture that the "availability over model choice" effect will weaken
      precisely in regimes where distributional forecast information becomes
      decision-relevant.</p>`,
    tex: `\\label{sec:conclusion}
We asked a deliberately narrow question---does adding a demand forecast
to the state improve a PPO inventory policy, and by how much?---and answered it
with a controlled ablation holding the algorithm, environment, and reward fixed.
With normalized observations, a bounded service-level reward, and an order lead
time that makes anticipation necessary, the forecast delivers a small but
significant mean advantage ($+0.146$, $\\approx 19\\%$, $t=4.54$). Two
qualifications matter as much as the headline: the benefit is \\emph{heterogeneous}
across demand profiles, and forecast \\emph{availability} dominates forecast
\\emph{model choice}. We release a reproducible, dependency-light pipeline and an
interactive in-browser digital twin so the result can be inspected and extended.

Three directions follow directly. First, \\emph{real data}: re-running the
identical pipeline on the M5 series~\\cite{makridakis2022m5} tests whether the
synthetic-demand findings transfer to intermittent, promotion-driven retail
demand. Second, \\emph{richer settings}: extending from a single stage to
dual-sourcing and multi-echelon systems~\\cite{gijsbrechts2022}, where the value
of anticipation may be larger. Third, \\emph{end-to-end and probabilistic
forecasting}: coupling forecaster and policy more tightly, as in end-to-end
newsvendor and inventory models~\\cite{oroojlooy2020newsvendor,qi2023}, and
exposing the agent to forecast \\emph{uncertainty} rather than a point estimate.
We conjecture the \`\`availability over model choice'' effect weakens precisely
where distributional forecast information becomes decision-relevant.`,
  },
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
  "V. Mnih et al., ``Human-level control through deep reinforcement learning,'' \\emph{Nature}, vol. 518, no. 7540, pp. 529--533, 2015.",
  "L. Breiman, ``Random forests,'' \\emph{Mach. Learn.}, vol. 45, no. 1, pp. 5--32, 2001.",
  "F. Pedregosa et al., ``Scikit-learn: Machine learning in Python,'' \\emph{J. Mach. Learn. Res.}, vol. 12, pp. 2825--2830, 2011.",
  "A. Raffin, A. Hill, A. Gleave, A. Kanervisto, M. Ernestus, and N. Dormann, ``Stable-Baselines3: Reliable reinforcement learning implementations,'' \\emph{J. Mach. Learn. Res.}, vol. 22, no. 268, pp. 1--8, 2021.",
  "M. Towers et al., ``Gymnasium: A standard interface for reinforcement learning environments,'' \\emph{arXiv:2407.17032}, 2024.",
  "A. Oroojlooyjadid, L. V. Snyder, and M. Tak\\'{a}\\v{c}, ``Applying deep learning to the newsvendor problem,'' \\emph{IISE Trans.}, vol. 52, no. 4, pp. 444--463, 2020.",
  "M. Qi, Y. Shi, Y. Qi, C. Ma, R. Yuan, D. Wu, and Z.-J. M. Shen, ``A practical end-to-end inventory management model with deep learning,'' \\emph{Manag. Sci.}, vol. 69, no. 2, pp. 759--773, 2023.",
  "R. N. Boute, J. Gijsbrechts, W. van Jaarsveld, and N. Vanvuchelen, ``Deep reinforcement learning for inventory control: A roadmap,'' \\emph{Eur. J. Oper. Res.}, vol. 298, no. 2, pp. 401--412, 2022.",
  "K. J. Arrow, S. Karlin, and H. Scarf, \\emph{Studies in the Mathematical Theory of Inventory and Production}. Stanford, CA, USA: Stanford Univ. Press, 1958.",
  "F. W. Harris, ``How many parts to make at once,'' \\emph{Factory, The Magazine of Management}, vol. 10, no. 2, pp. 135--136, 1913.",
  "S. Nahmias and T. L. Olsen, \\emph{Production and Operations Analysis}, 7th ed. Long Grove, IL, USA: Waveland Press, 2015.",
  "H. Scarf, ``The optimality of $(s,S)$ policies in the dynamic inventory problem,'' in \\emph{Mathematical Methods in the Social Sciences}, K. J. Arrow, S. Karlin, and P. Suppes, Eds. Stanford, CA, USA: Stanford Univ. Press, 1960, pp. 196--202.",
  "G. Shani, D. Heckerman, and R. I. Brafman, ``An MDP-based recommender system,'' \\emph{J. Mach. Learn. Res.}, vol. 6, pp. 1265--1295, 2005.",
  "R. S. Sutton, ``Learning to predict by the methods of temporal differences,'' \\emph{Mach. Learn.}, vol. 3, no. 1, pp. 9--44, 1988.",
  "J. Schulman, S. Levine, P. Abbeel, M. Jordan, and P. Moritz, ``Trust region policy optimization,'' in \\emph{Proc. Int. Conf. Mach. Learn. (ICML)}, 2015, pp. 1889--1897.",
  "J. Schulman, P. Moritz, S. Levine, M. Jordan, and P. Abbeel, ``High-dimensional continuous control using generalized advantage estimation,'' in \\emph{Proc. Int. Conf. Learn. Representations (ICLR)}, 2016.",
  "S. Makridakis, E. Spiliotis, and V. Assimakopoulos, ``The M4 competition: 100,000 time series and 61 forecasting methods,'' \\emph{Int. J. Forecast.}, vol. 36, no. 1, pp. 54--74, 2020.",
  "T. Hochreiter and J. Schmidhuber, ``Long short-term memory,'' \\emph{Neural Comput.}, vol. 9, no. 8, pp. 1735--1780, 1997.",
];
/* LaTeX \\bibitem keys, in the SAME order as REFERENCES (1..n). */
const REF_KEYS = [
  "sutton2018", "schulman2017ppo", "oroojlooy2022beer",
  "gijsbrechts2022", "makridakis2022m5", "clark1960", "zipkin2000",
  "mnih2015", "breiman2001", "pedregosa2011", "raffin2021sb3",
  "towers2024gym", "oroojlooy2020newsvendor", "qi2023", "boute2022roadmap",
  "arrow1958", "harris1913", "nahmias2015", "scarf1960ss", "shani2005mdp",
  "sutton1988td", "schulman2015trpo", "schulman2016gae", "makridakis2020m4",
  "hochreiter1997lstm",
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
  ["method", "Methodology"],
  ["results", "Results and Discussion"],
  ["conclusion", "Conclusion"],
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
    // drop inline SVG diagrams (Word can't render them); keep the caption text
    .replace(/<svg[\s\S]*?<\/svg>/gi, "[see Fig. 1 in the online/LaTeX version]")
    .replace(/\$\$([^$]+)\$\$/g, "<div style='text-align:center;font-style:italic;'>$1</div>")
    .replace(/\$([^$]+)\$/g, "$1")   // inline $...$ delimiters
    .replace(/\\underbrace\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}_\{[^}]*\}/g, "$1")  // drop underbrace label
    .replace(/\\approx/g, "\u2248")
    .replace(/\\times/g, "\u00d7")
    .replace(/\\pm/g, "\u00b1")
    .replace(/\\le(?:q)?/g, "\u2264")
    .replace(/\\ge(?:q)?/g, "\u2265")
    .replace(/\\cdot/g, "\u00b7")
    .replace(/\\ge\b/g, "\u2265")
    .replace(/\\mathbb\{E\}/g, "E").replace(/\\mathbb\{1\}/g, "1")
    .replace(/\\mathcal\{([^}]*)\}/g, "$1")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\mathrm\{([^}]*)\}/g, "$1")
    .replace(/\\hat\s*([a-zA-Z])/g, "$1\u0302")
    .replace(/\\bar\s*([a-zA-Z])/g, "$1\u0304")
    .replace(/\\sum/g, "\u03a3").replace(/\\min/g, "min").replace(/\\max/g, "max")
    .replace(/\\gamma/g, "\u03b3").replace(/\\epsilon/g, "\u03b5")
    .replace(/\\Delta/g, "\u0394")
    .replace(/\\rho/g, "\u03c1").replace(/\\pi/g, "\u03c0").replace(/\\phi/g, "\u03c6")
    .replace(/\\theta/g, "\u03b8").replace(/\\ell/g, "\u2113")
    .replace(/\\in\b/g, "\u2208").replace(/\\mid/g, "|")
    .replace(/\\tfrac1\{?([^}\s]+)\}?/g, "1/$1")
    .replace(/\\,|\\!|\\;|\\big|\\Big|\\left|\\right/g, "")
    .replace(/\\%/g, "%")
    .replace(/\\emph\{([^}]*)\}/g, "<i>$1</i>")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\text(?:bf|it|rm)?\{([^}]*)\}/g, "$1")
    .replace(/_\{([^}]*)\}/g, "<sub>$1</sub>").replace(/_([a-zA-Z0-9])/g, "<sub>$1</sub>")
    .replace(/\^\{([^}]*)\}/g, "<sup>$1</sup>").replace(/\^([a-zA-Z0-9])/g, "<sup>$1</sup>")
    // catch-all: unwrap any residual \cmd{...} to its content, then drop lone \cmd and stray braces
    .replace(/\\[a-zA-Z]+\{([^{}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}]/g, "");
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
