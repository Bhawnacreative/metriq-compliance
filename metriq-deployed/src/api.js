const API=import.meta.env.VITE_API_URL||"http://localhost:8000";
async function request(path,options={}){const r=await fetch(`${API}${path}`,options);let data={};try{data=await r.json()}catch{}if(!r.ok)throw new Error(data.detail||"Request failed");return data}
export async function login(email, password, role) {
  return request("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: String(email).trim(),
      password: String(password),
      role: String(role).toLowerCase(),
    }),
  });
}
export async function scanProduct(file,token){const fd=new FormData();fd.append("file",file);return request("/api/scan",{method:"POST",headers:token?{Authorization:`Bearer ${token}`}:{},body:fd})}
export async function getScans(token){return request("/api/scans",{headers:token?{Authorization:`Bearer ${token}`}:{}})}
export const reportUrl=id=>`${API}/api/scans/${id}/report`;
export const apiBase=API;

export const ocrText=result=>result?.ocr_text||"";
