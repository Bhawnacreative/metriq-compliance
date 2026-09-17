import io, os, re, uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image, ImageOps
import pytesseract
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import json
import hashlib
import hmac
import base64


KB_PATH=Path(__file__).resolve().parents[1]/'knowledge_base/packaged_commodities_rules.json'
KB=json.loads(KB_PATH.read_text(encoding='utf-8'))

app=FastAPI(title="METRIQ Compliance API", version="1.0.0")
origins=os.getenv("FRONTEND_ORIGIN","*").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

DATA=Path(os.getenv("DATA_DIR","./data"))
DATA.mkdir(exist_ok=True)
DB=DATA/"scans.json"
if not DB.exists(): DB.write_text("[]",encoding="utf-8")

def compliance_from_text(text):
    low=text.lower()
    imported=bool(re.search(r"imported|importer|country\\s+of\\s+origin|made\\s+in\\s+(?!india)", low, re.I))
    checks=[]
    for rule in KB["rules"]:
        field=rule["field"]
        if field=="origin" and not imported:
            checks.append({"key":field,"rule_id":rule["id"],"rule":rule["rule"],"label":rule["title"],"status":"not_applicable","confidence":0.92,"evidence":[]})
            continue
        if field=="common_name":
            found=any(x in low for x in rule["patterns"])
        else:
            found=any(re.search(p,low,re.I) for p in rule["patterns"])
        evidence=[line.strip() for line in text.splitlines() if line.strip() and any(re.search(p,line,re.I) for p in rule["patterns"])]
        status="passed" if found else "warning"
        checks.append({"key":field,"rule_id":rule["id"],"rule":rule["rule"],"label":rule["title"],"status":status,"confidence":0.95 if found else 0.38,"evidence":evidence[:3]})
    applicable=[x for x in checks if x["status"]!="not_applicable"]
    passed=sum(x["status"]=="passed" for x in applicable)
    score=round(100*passed/len(applicable)) if applicable else 0
    issues=len(applicable)-passed
    status="Compliant" if score>=90 else ("Needs Review" if score>=70 else "Potential Non-compliance")
    return checks,score,issues,status

def load_db():
    try: return __import__("json").loads(DB.read_text(encoding="utf-8"))
    except: return []

def save_db(rows): DB.write_text(__import__("json").dumps(rows,indent=2),encoding="utf-8")

def extract(text):
    low=text.lower()
    checks=[]
    for key,label,pats in RULES:
        found=any(re.search(p,low,re.I) for p in pats)
        checks.append({"key":key,"label":label,"status":"passed" if found else "warning","confidence":0.94 if found else 0.35})
    passed=sum(x["status"]=="passed" for x in checks)
    score=round((passed/len(checks))*100)
    issues=len(checks)-passed
    status="Compliant" if score>=90 else "Warning" if score>=70 else "Non-compliant"
    return checks,score,issues,status

def ocr_image(raw):
    try:
        img=Image.open(io.BytesIO(raw))
        img=ImageOps.exif_transpose(img).convert("RGB")
        # Upscale improves OCR on phone/product photos
        img=img.resize((img.width*2,img.height*2))
        text=pytesseract.image_to_string(img,config="--psm 6")
        return text.strip()
    except Exception as e:
        raise HTTPException(500,f"OCR failed: {e}")


AUTH_SECRET=os.getenv("AUTH_SECRET","change-this-secret-before-production")

def make_token(email, role):
    payload=f"{email}|{role}|{int(datetime.now(timezone.utc).timestamp())}"
    sig=hmac.new(AUTH_SECRET.encode(),payload.encode(),hashlib.sha256).hexdigest()
    return base64.urlsafe_b64encode(f"{payload}|{sig}".encode()).decode()

def verify_token(token):
    try:
        raw=base64.urlsafe_b64decode(token.encode()).decode()
        email,role,ts,sig=raw.rsplit("|",3)
        payload=f"{email}|{role}|{ts}"
        good=hmac.compare_digest(sig,hmac.new(AUTH_SECRET.encode(),payload.encode(),hashlib.sha256).hexdigest())
        if not good: return None
        return {"email":email,"role":role}
    except Exception:
        return None

@app.post("/api/auth/login")
async def login(credentials: dict):
    email=str(credentials.get("email","")).strip().lower()
    password=str(credentials.get("password",""))
    role=str(credentials.get("role","")).strip().lower()
    accounts={
        "customer": {
            "email":os.getenv("CUSTOMER_EMAIL","customer@metriq.local"),
            "password":os.getenv("CUSTOMER_PASSWORD","customer123")
        },
        "master": {
            "email":os.getenv("MASTER_EMAIL","master@metriq.local"),
            "password":os.getenv("MASTER_PASSWORD","master123")
        }
    }
    if role not in accounts or email != accounts[role]["email"].lower() or password != accounts[role]["password"]:
        raise HTTPException(401,"Invalid email, password or account type.")
    return {"token":make_token(email,role),"user":{"email":email,"role":role,"name":"Master Inspector" if role=="master" else "Customer"}}

@app.get("/api/auth/me")
def me(authorization: Optional[str]=None):
    token=authorization.replace("Bearer ","") if authorization else ""
    user=verify_token(token)
    if not user: raise HTTPException(401,"Not authenticated")
    return user



@app.post("/api/ocr")
async def ocr_only(file: UploadFile=File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400,"Please upload an image.")
    raw=await file.read()
    if len(raw)>12*1024*1024:
        raise HTTPException(413,"Image must be smaller than 12 MB.")
    text=ocr_image(raw)
    return {"text":text,"characters":len(text),"lines":len([x for x in text.splitlines() if x.strip()])}

@app.get("/api/rules")
def rules(): return KB

@app.get("/api/health")
def health(): return {"status":"ok","service":"metriq-compliance-api","timestamp":datetime.now(timezone.utc).isoformat()}

@app.post("/api/scan")
async def scan(file: UploadFile=File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400,"Please upload a PNG, JPG, JPEG or WEBP image.")
    raw=await file.read()
    if len(raw)>12*1024*1024: raise HTTPException(413,"Image must be smaller than 12 MB.")
    text=ocr_image(raw)
    checks,score,issues,status=compliance_from_text(text)
    sid=str(uuid.uuid4())
    now=datetime.now(timezone.utc).isoformat()
    result={"id":sid,"product":Path(file.filename or "Uploaded Product").stem.replace("_"," ").replace("-"," ").title(),
            "filename":file.filename,"date":now,"score":score,"status":status,"issues":issues,
            "checks":checks,"ocr_text":text}
    rows=load_db(); rows.insert(0,result); save_db(rows[:100])
    return result

@app.get("/api/scans")
def scans(): return load_db()

@app.get("/api/scans/{scan_id}")
def get_scan(scan_id:str):
    for x in load_db():
        if x["id"]==scan_id: return x
    raise HTTPException(404,"Scan not found")

@app.get("/api/scans/{scan_id}/report")
def report(scan_id:str):
    item=None
    for x in load_db():
        if x["id"]==scan_id: item=x; break
    if not item: raise HTTPException(404,"Scan not found")
    buf=io.BytesIO(); c=canvas.Canvas(buf,pagesize=A4); w,h=A4
    c.setFont("Helvetica-Bold",20); c.drawString(48,h-55,"METRIQ Compliance Report")
    c.setFont("Helvetica",10); c.drawString(48,h-75,f"Scan ID: {item['id']}")
    c.drawString(48,h-90,f"Generated: {item['date']}")
    c.setFont("Helvetica-Bold",15); c.drawString(48,h-125,item["product"])
    c.setFont("Helvetica-Bold",28); c.drawString(48,h-170,f"Score: {item['score']}%")
    c.setFont("Helvetica",11); c.drawString(48,h-190,f"Status: {item['status']}")
    y=h-230
    c.setFont("Helvetica-Bold",12); c.drawString(48,y,"Declaration checks"); y-=22
    c.setFont("Helvetica",10)
    for check in item["checks"]:
        c.drawString(60,y,f"{'PASS' if check['status']=='passed' else 'WARNING'}  {check['label']}")
        y-=18
        if y<70: c.showPage(); y=h-55; c.setFont("Helvetica",10)
    c.showPage(); c.save()
    return Response(buf.getvalue(),media_type="application/pdf",headers={"Content-Disposition":f'attachment; filename="metriq-{scan_id}.pdf"'})
