# METRIQ - Deployment Package

This package is ready to deploy as a React/Vite frontend + FastAPI/Tesseract backend.

## 1. Backend - Render

Create a new **Web Service** from this repository and use:

- Root Directory: `backend`
- Runtime: `Docker`
- Health Check Path: `/api/health`

Environment variables:

- `FRONTEND_ORIGIN=https://YOUR-FRONTEND.vercel.app`
- `AUTH_SECRET=<long-random-secret>`
- `CUSTOMER_EMAIL=<customer-login-email>`
- `CUSTOMER_PASSWORD=<customer-login-password>`
- `MASTER_EMAIL=<master-login-email>`
- `MASTER_PASSWORD=<master-login-password>`

The Docker image installs Tesseract OCR automatically.

## 2. Frontend - Vercel

Import the same repository into Vercel.

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `/`

Set this environment variable in Vercel:

`VITE_API_URL=https://YOUR-METRIQ-API.onrender.com`

Deploy the frontend.

## 3. Important: connect the two URLs

After Vercel gives you the frontend URL, update the Render backend variable:

`FRONTEND_ORIGIN=https://YOUR-FRONTEND.vercel.app`

Then redeploy the backend if required.

## 4. Camera scanning

Camera scanning requires `localhost` during local development or HTTPS after deployment. Vercel provides HTTPS, so browser camera access can work on the deployed site after permission is granted.

## 5. OCR

The backend uses real Tesseract OCR. The Dockerfile installs the OCR engine, so no Windows Tesseract installation is required on the hosting server.

## 6. Security

Do not use the demo credentials in production. Set all authentication environment variables and a strong `AUTH_SECRET`.

## 7. SPA routing

`vercel.json` and `public/_redirects` are included so routes such as `/login`, `/scan`, `/results`, `/history`, and `/reports` can work on a static frontend host.

## 8. Local verification

Frontend:

`npm install`

`npm run dev`

Backend:

`cd backend`

`python -m pip install -r requirements.txt`

`python -m uvicorn app.main:app --reload --port 8000`

Then create a frontend `.env` containing:

`VITE_API_URL=http://localhost:8000`

This package is deployment-ready. Publishing it to a personal Vercel/Render account requires access to that account.
