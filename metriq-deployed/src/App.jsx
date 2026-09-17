import React from "react";
import {Routes,Route,Navigate,useLocation} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import Reports from "./pages/Reports";
import History from "./pages/History";
import Login from "./pages/Login";
import {useApp} from "./context/AppContext";

function Protected({children}){const {user}=useApp();return user?children:<Navigate to="/login" replace/>}
function Role({role,children}){const {user}=useApp();return user?.role===role?children:<Navigate to="/dashboard" replace/>}

export default function App(){return <Routes>
 <Route path="/login" element={<Login/>}/>
 <Route path="/" element={<Protected><Layout><Navigate to="/dashboard" replace/></Layout></Protected>}/>
 <Route path="/dashboard" element={<Protected><Layout><Dashboard/></Layout></Protected>}/>
 <Route path="/scan" element={<Protected><Layout><Scan/></Layout></Protected>}/>
 <Route path="/results" element={<Protected><Layout><Results/></Layout></Protected>}/>
 <Route path="/reports" element={<Protected><Layout><Reports/></Layout></Protected>}/>
 <Route path="/history" element={<Protected><Layout><History/></Layout></Protected>}/>
 <Route path="*" element={<Navigate to="/login" replace/>}/>
 </Routes>}
