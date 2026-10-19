/* PIB 2026 — in-browser inventory-RL digital twin.
   Mirrors the Python InventoryEnv (lead time, normalised obs, service-level
   reward) and runs a lightweight order-up-to policy that is tuned online so
   visitors can watch forecast-aware vs baseline control live. */

(() => {
  "use strict";

  // ---- seeded RNG ----
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

  // ---- synthetic demand (matches make_synthetic_sales spirit) ----
  function makeDemand(n, seed){
    const r = mulberry32(seed);
    const base = 8 + r()*12, aW = 3 + r()*4, aY = 2 + r()*4;
    const pW = r()*6.28, pY = r()*6.28, trend = (r()*0.006 - 0.002);
    const d = new Float64Array(n);
    for(let t=0;t<n;t++){
      let v = base + aW*Math.sin(2*Math.PI*t/7 + pW)
                   + aY*Math.sin(2*Math.PI*t/365 + pY)
                   + trend*t + (r()*2-1)*1.2;
      d[t] = Math.max(0, Math.round(v));
    }
    return d;
  }

  // one-step forecast: mean of last `lag` days + weekly slope (cheap proxy
  // for the fitted regressor, good enough to drive the twin visually)
  function forecastAt(d, t, lag){
    if(t < lag) return d[t]||0;
    let s=0; for(let i=t-lag;i<t;i++) s+=d[i];
    const mean = s/lag;
    const wk = (d[t-1]!==undefined && d[t-7]!==undefined) ? (d[t-1]-d[t-7])/7 : 0;
    return Math.max(0, mean + wk);
  }

  // ---- environment rollout with an order-up-to policy ----
  // S = target position (inventory + pipeline). Baseline uses a flat S;
  // forecast policy sets S from the forecast over the lead-time horizon.
  function rollout(d, {lag=7, lead=2, useForecast, S, noise=0, carbon=false, seed=1}){
    const r = mulberry32(seed*7919+13);
    const scale = Math.max(1, d.reduce((a,b)=>a+b,0)/d.length);
    let inv = scale, backlog = 0;
    const queue = new Array(lead).fill(0);
    const trace = {inv:[], demand:[], order:[], forecast:[], reward:[], fill:[]};
    let totR=0, totFill=0, steps=0;
    for(let t=lag; t<d.length-1; t++){
      const fc = forecastAt(d, t, lag) + (noise? (r()*2-1)*noise : 0);
      const pipeline = queue.reduce((a,b)=>a+b,0);
      // target position
      let target;
      if(useForecast){
        // cover expected demand over lead time + safety
        target = fc*(lead+1)*S;
      } else {
        target = scale*(lead+1)*S;      // demand-blind flat target
      }
      let order = Math.max(0, target - inv - pipeline);
      order = Math.min(order, 3*scale);

      const arrive = queue.shift(); queue.push(order);
      inv += arrive;
      const required = d[t] + backlog;
      const sales = Math.min(inv, required);
      inv -= sales; backlog = Math.max(0, required - sales);

      const fill = required>0 ? sales/required : 1;
      let reward = fill - 0.05*(inv/scale);
      if(carbon) reward -= 0.02*(order/scale);

      totR += reward; totFill += fill; steps++;
      trace.inv.push(inv); trace.demand.push(d[t]); trace.order.push(order);
      trace.forecast.push(fc); trace.reward.push(reward); trace.fill.push(fill);
    }
    return {avgReward: totR/steps, avgFill: totFill/steps, trace, scale};
  }

  // tiny 1-D search for the best order-up-to multiplier S (stand-in for PPO)
  function tune(d, opts){
    let best=null;
    for(let S=0.6; S<=1.8; S+=0.1){
      const res = rollout(d, {...opts, S});
      if(!best || res.avgReward > best.avgReward) best = {...res, S};
    }
    return best;
  }

  // ---------------- canvas drawing ----------------
  const C = id => document.getElementById(id);
  function line(ctx, arr, x0, y0, w, h, color, lo, hi, step=1){
    ctx.strokeStyle=color; ctx.lineWidth=1.6; ctx.beginPath();
    const n=arr.length;
    for(let i=0;i<n;i+=step){
      const x=x0 + (i/(n-1))*w;
      const y=y0 + h - ((arr[i]-lo)/(hi-lo))*h;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  function clearc(cv){const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);return c;}

  function drawTwin(res){
    const cv=C('twinCanvas'), ctx=clearc(cv);
    const W=cv.width, H=cv.height, pad=28;
    const demand=res.trace.demand, inv=res.trace.inv, fc=res.trace.forecast;
    const win=200, s=Math.max(0,demand.length-win);
    const dd=demand.slice(s), ii=inv.slice(s), ff=fc.slice(s);
    const all=dd.concat(ii).concat(ff);
    const hi=Math.max(...all)*1.1, lo=0;
    // grid
    ctx.strokeStyle='#16233d'; ctx.lineWidth=1;
    for(let g=0;g<=4;g++){const y=pad+(H-2*pad)*g/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();}
    line(ctx, dd, pad, pad, W-2*pad, H-2*pad, '#8aa0c6', lo, hi);
    line(ctx, ff, pad, pad, W-2*pad, H-2*pad, '#4da3ff', lo, hi);
    line(ctx, ii, pad, pad, W-2*pad, H-2*pad, '#37d67a', lo, hi);
  }
  function drawReward(a,b){
    const cv=C('rewardCanvas'), ctx=clearc(cv);
    const W=cv.width,H=cv.height,pad=24;
    const ra=a.trace.reward, rb=b.trace.reward;
    const win=200,s=Math.max(0,ra.length-win);
    const A=ra.slice(s),B=rb.slice(s);
    const all=A.concat(B),hi=Math.max(...all),lo=Math.min(...all);
    ctx.strokeStyle='#16233d';for(let g=0;g<=3;g++){const y=pad+(H-2*pad)*g/3;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();}
    line(ctx,B,pad,pad,W-2*pad,H-2*pad,'#ff9f43',lo,hi);
    line(ctx,A,pad,pad,W-2*pad,H-2*pad,'#4da3ff',lo,hi);
  }

  // ---------------- run + wire up ----------------
  let demandSeries;
  function run(){
    const seed=+C('seed').value, carbon=C('carbon').checked, noise=+C('noise').value;
    const lead=+C('lead').value;
    demandSeries = makeDemand(1000, seed);
    const common={lag:7, lead, noise, carbon, seed};
    const fc  = tune(demandSeries, {...common, useForecast:true});
    const base= tune(demandSeries, {...common, useForecast:false});
    drawTwin(fc); drawReward(fc, base);

    C('vFc').textContent   = fc.avgReward.toFixed(3);
    C('vBase').textContent = base.avgReward.toFixed(3);
    const adv = fc.avgReward - base.avgReward;
    const el=C('vAdv'); el.textContent=(adv>=0?'+':'')+adv.toFixed(3);
    el.className='v '+(adv>0?'good':'bad');
    C('vFill').textContent = (fc.avgFill*100).toFixed(1)+'%';
    C('summary').textContent =
      `Forecast policy holds ~${(fc.avgFill*100).toFixed(0)}% service level; ` +
      `forecast ${adv>0?'improves':'does not improve'} reward by ${(adv>=0?'+':'')}${adv.toFixed(3)} ` +
      `(${(adv/Math.max(1e-9,base.avgReward)*100).toFixed(0)}% vs baseline) on this demand profile.`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    C('btnRun').addEventListener('click', run);
    C('noise').addEventListener('input', ()=>C('noiseVal').textContent=(+C('noise').value).toFixed(1));
    run();
  });
})();
