import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import {getScans} from "../api";
const C=createContext(null);
export function AppProvider({children}){
 const [dark,setDark]=useState(()=>localStorage.getItem("metriq-theme")==="dark");
 const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("metriq-user")||"null"));
 const [token,setToken]=useState(()=>localStorage.getItem("metriq-token")||"");
 const [history,setHistory]=useState([]),[current,setCurrent]=useState(null);
 useEffect(()=>{document.documentElement.classList.toggle("dark",dark);localStorage.setItem("metriq-theme",dark?"dark":"light")},[dark]);
 useEffect(()=>{if(token)getScans(token).then(setHistory).catch(()=>setHistory([]));else setHistory([])},[token]);
 const signIn=(data)=>{setToken(data.token);setUser(data.user);localStorage.setItem("metriq-token",data.token);localStorage.setItem("metriq-user",JSON.stringify(data.user))};
 const signOut=()=>{setToken("");setUser(null);setCurrent(null);localStorage.removeItem("metriq-token");localStorage.removeItem("metriq-user")};
 const addScan=x=>{setCurrent(x);setHistory(h=>[x,...h.filter(a=>a.id!==x.id)])};
 return <C.Provider value={useMemo(()=>({dark,toggleTheme:()=>setDark(v=>!v),user,token,signIn,signOut,history,current,addScan}),[dark,user,token,history,current])}>{children}</C.Provider>
}
export const useApp=()=>useContext(C);
