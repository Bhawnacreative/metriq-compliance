import React,{useState} from "react";
export default function Scanner3D({image,scanning=false}){
 const [rx,setRx]=useState(0),[ry,setRy]=useState(0);
 const move=e=>{const r=e.currentTarget.getBoundingClientRect();setRy(((e.clientX-r.left)/r.width-.5)*7);setRx(-((e.clientY-r.top)/r.height-.5)*5)};
 return <div onMouseMove={move} onMouseLeave={()=>{setRx(0);setRy(0)}} className="relative mx-auto h-[430px] w-full max-w-[650px] [perspective:1200px]">
  <div className="absolute left-1/2 top-[46%] h-[280px] w-[440px] -translate-x-1/2 rounded-full border border-[#ffb547]/10 bg-[#ffb547]/5 blur-2xl"/>
  <div className="absolute left-1/2 top-[43%] h-[1px] w-[400px] -translate-x-1/2 bg-[#ff5a5f]/30 shadow-[0_0_35px_10px_rgba(255,90,95,.25)]"/>
  {/* product floating in front of scan field */}
  {image&&<div className="absolute left-[55%] top-[38%] z-30 h-[175px] w-[118px] -translate-x-1/2 animate-float [transform-style:preserve-3d]" style={{transform:`translateX(-50%) translateZ(150px) rotateX(${rx*.4}deg) rotateY(${ry*.4}deg)`}}><div className="h-full w-full overflow-hidden rounded-2xl border-2 border-white bg-white shadow-[0_30px_60px_rgba(0,0,0,.5)]"><img src={image} alt="Product to scan" className="h-full w-full object-contain"/></div></div>}
  {/* barcode scanner body */}
  <div className="absolute left-[30%] top-[24%] z-20 h-[250px] w-[190px] transition-transform duration-200 [transform-style:preserve-3d]" style={{transform:`rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(-8deg)`}}>
    <div className="absolute left-8 top-0 h-[120px] w-[150px] rounded-[34px] bg-gradient-to-br from-[#3b3538] via-[#171416] to-[#070607] shadow-[25px_30px_45px_rgba(0,0,0,.55)] [transform:translateZ(30px)]"/>
    <div className="absolute left-8 top-[100px] h-[155px] w-[105px] rounded-b-[34px] rounded-t-xl bg-gradient-to-r from-[#262124] to-[#0b090b] shadow-2xl [transform:translateZ(20px)]"/>
    <div className="absolute left-[30px] top-[20px] z-20 grid h-20 w-28 place-items-center rounded-2xl border border-[#ffb547]/30 bg-[#080708] shadow-[inset_0_0_30px_rgba(255,159,67,.08)] [transform:translateZ(45px)]"><div className="h-8 w-16 rounded-lg bg-[#ff5a5f]/20 shadow-[0_0_25px_8px_rgba(255,90,95,.25)]">{scanning&&<div className="h-1 w-full translate-y-3 rounded-full bg-[#ff5a5f] shadow-[0_0_18px_5px_#ff5a5f] animate-pulse"/>}</div></div>
    <div className="absolute left-[68px] top-[102px] z-30 h-5 w-10 rounded-full bg-[#ffb547] shadow-[0_0_18px_#ffb547] [transform:translateZ(50px)]"/>
  </div>
  {/* laser target */}
  <div className={`absolute left-[62%] top-[41%] z-10 h-[120px] w-[150px] -translate-x-1/2 rounded-2xl border ${scanning?"border-[#ff5a5f]/70 bg-[#ff5a5f]/5":"border-white/10"} transition-all duration-500`}>
   <span className="absolute -top-5 left-1 text-[8px] uppercase tracking-[.2em] text-white/30">{scanning?"TARGET LOCKED":"SCAN FIELD"}</span>
   {scanning&&<div className="absolute left-0 right-0 top-1/2 h-px bg-[#ff5a5f] shadow-[0_0_16px_4px_#ff5a5f] animate-beam"/>}
  </div>
  <div className="absolute bottom-2 left-1/2 h-5 w-[420px] -translate-x-1/2 rounded-full bg-black/40 blur-xl"/>
 </div>
}