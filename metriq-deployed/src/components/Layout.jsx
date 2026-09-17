import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const nav=[["Dashboard","/dashboard","⌂"],["Scan Product","/scan","⌁"],["Results","/results","✓"],["Reports","/reports","▤"],["History","/history","◷"]];

export default function Layout({children}) {
  const {dark,toggleTheme,user,signOut}=useApp(), loc=useLocation();
  return <div className="min-h-screen bg-[#fff9f4] text-[#241a1d] transition-colors dark:bg-[#101012] dark:text-[#f7eee9]">
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] border-r border-[#7f1d3a]/10 bg-[#fffaf7]/90 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#151316]/95 lg:block">
      <NavBrand/>
      <div className="space-y-2">{nav.map(([label,path,icon])=><Navigation key={path} label={label} path={path} icon={icon}/>)}</div>
      <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-gradient-to-br from-[#4d1529] via-[#7f1d3a] to-[#ff5a5f] p-4 text-white shadow-lg">
        <div className="text-[10px] uppercase tracking-[.2em] text-white/60">System status</div>
        <div className="mt-2 flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-[#19c37d] shadow-[0_0_12px_#19c37d]"/> Scanner ready</div>
      </div>
    </aside>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-[#fff9f4]/85 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#101012]/85 lg:ml-[220px] lg:px-8">
      <div><div className="text-[10px] uppercase tracking-[.2em] text-[#7f1d3a]/65 dark:text-[#ffb547]/80">Legal Metrology Intelligence</div><div className="font-display font-bold">{loc.pathname==="/scan"?"Product Scanner":loc.pathname==="/results"?"Compliance Analysis":"Compliance Workspace"}</div></div>
      <div className="flex items-center gap-2"><span className="hidden rounded-full bg-[#19c37d]/10 px-3 py-1 text-[10px] font-bold text-[#19c37d] sm:inline">● LIVE</span><span className="hidden rounded-full bg-[#7f1d3a]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#7f1d3a] dark:bg-white/5 dark:text-[#ffb547] md:inline">{user?.role}</span><button aria-label="Toggle dark mode" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white/70 text-lg transition hover:-translate-y-0.5 hover:rotate-6 dark:border-white/10 dark:bg-white/5">{dark?"☀":"☾"}</button></div>
    </header>
    <main className="grid-bg min-h-[calc(100vh-4rem)] p-4 pb-24 lg:ml-[220px] lg:p-8">{children}</main>
    <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-5 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#171518]/95 lg:hidden">{nav.map(([label,path,icon])=><Navigation key={path} label={label.split(" ")[0]} path={path} icon={icon} mobile/>)}</nav>
  </div>
}
function NavBrand(){return <div className="mb-10 flex items-center gap-3 px-2"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#7f1d3a] to-[#ff5a5f] text-xl font-black text-white shadow-glow">M</div><div><div className="font-display font-bold tracking-tight">METRIQ</div><div className="text-[9px] uppercase tracking-[.22em] text-[#7f1d3a] dark:text-[#ffb547]">Compliance AI</div></div></div>}
function Navigation({label,path,icon,mobile}){return <NavLink to={path} className={({isActive})=>`flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${mobile?"py-2 text-[10px]":"justify-start"} ${isActive?"bg-[#7f1d3a] text-white shadow-lg shadow-[#7f1d3a]/20":"text-[#66585b] hover:-translate-y-0.5 hover:bg-[#7f1d3a]/7 dark:text-[#c9bec1] dark:hover:bg-white/5"}`}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/5 text-base dark:bg-white/5">{icon}</span>{!mobile&&label}{mobile&&<span>{label}</span>}</NavLink>}