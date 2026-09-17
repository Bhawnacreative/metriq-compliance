import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../context/AppContext";
import Scanner3D from "../components/Scanner3D";

export default function Dashboard(){
 const nav=useNavigate(),{history,current}=useApp(); const [demo,setDemo]=useState(null);
 const startDemo=()=>{setDemo("demo");setTimeout(()=>setDemo("done"),2300);setTimeout(()=>nav("/results"),3300)};
 return <div className="mx-auto max-w-[1450px] space-y-5">
  <section className="relative min-h-[720px] overflow-hidden rounded-[40px] border border-black/10 bg-[#171113] text-white shadow-2xl dark:border-white/10">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,159,67,.16),transparent_28%),radial-gradient(circle_at_40%_80%,rgba(255,90,95,.12),transparent_30%)]"/>
   <div className="absolute inset-0 opacity-30 grid-bg"/>
   <div className="relative z-10 flex items-center justify-between p-6 lg:p-8">
    <div><div className="text-[10px] font-bold uppercase tracking-[.28em] text-[#ffb547]">METRIQ / VISUAL INSPECTION LAB</div><h1 className="mt-2 font-display text-3xl font-black lg:text-5xl">Compliance, in 3D.</h1><p className="mt-2 max-w-xl text-sm text-white/50">Place a package in the field. The scanner finds it, reads it and builds a compliance result.</p></div>
    <button onClick={()=>nav("/scan")} className="hidden rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/15 sm:block">Open scanner ↗</button>
   </div>
   <div className="relative z-10 grid min-h-[560px] lg:grid-cols-[340px_1fr]">
    <div className={`m-5 hidden self-center rounded-[28px] border border-white/10 bg-white/[.06] p-5 backdrop-blur-xl transition-all duration-700 lg:block ${demo?"translate-x-0 opacity-100":"-translate-x-8 opacity-90"}`}>
      <div className="text-[10px] uppercase tracking-[.2em] text-[#ffb547]">Live result</div>
      <div className="mt-4 text-6xl font-black">{demo?"96%":"--"}</div>
      <div className={`mt-1 text-xs font-bold uppercase tracking-widest ${demo?"text-[#19c37d]":"text-white/30"}`}>{demo?"Compliant":"Waiting for scan"}</div>
      <div className="mt-6 space-y-2">{["MRP","Net Quantity","Manufacturer","Country of Origin","Consumer Care"].map((x,i)=><div key={x} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-xs"><span>{x}</span><span className={demo&&i===4?"text-[#ffb547]":"text-[#19c37d]"}>{demo&&i===4?"⚠":"✓"}</span></div>)}</div>
      {demo&&<button onClick={()=>nav("/results")} className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#ffb547] to-[#ff5a5f] py-3 text-xs font-black text-[#241015]">OPEN FULL ANALYSIS</button>}
    </div>
    <div className="relative flex items-center justify-center">
      <div className="absolute left-[15%] top-[12%] animate-float rounded-2xl border border-white/10 bg-white/10 p-3 text-xs backdrop-blur-xl">MRP ✓</div>
      <div className="absolute right-[12%] top-[25%] animate-float rounded-2xl border border-white/10 bg-white/10 p-3 text-xs backdrop-blur-xl [animation-delay:1s]">NET QTY ✓</div>
      <div className="absolute bottom-[18%] left-[18%] animate-float rounded-2xl border border-white/10 bg-white/10 p-3 text-xs backdrop-blur-xl [animation-delay:2s]">ORIGIN ✓</div>
      <Scanner3D image={null} scanning={demo==="demo"}/>
      {!demo&&<div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"><button onClick={startDemo} className="rounded-2xl bg-gradient-to-r from-[#ffb547] to-[#ff5a5f] px-7 py-3 font-black text-[#241015] shadow-[0_0_35px_rgba(255,159,67,.2)] transition hover:-translate-y-1">▶ PLAY 3D SCAN DEMO</button><div className="mt-2 text-[9px] uppercase tracking-[.2em] text-white/30">or upload your own product</div></div>}
      {demo==="demo"&&<div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-[#ffb547]/30 bg-black/40 px-5 py-2 text-xs font-bold text-[#ffb547] backdrop-blur-xl">SCANNER LOCKED • ANALYZING PACKAGE</div>}
    </div>
   </div>
  </section>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["1,248","TOTAL SCANS"],["1,087","COMPLIANT"],["161","ISSUES FOUND"],["94.6%","AVG SCORE"]].map(([n,l])=><div key={l} className="glass rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:rotate-[.5deg]"><div className="font-display text-3xl font-black">{n}</div><div className="mt-1 text-[10px] font-bold tracking-[.16em] text-[#75666a] dark:text-[#bdb2b5]">{l}</div></div>)}</div>
 </div>
}