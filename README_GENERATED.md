# Quicky (QuickShare)

Lightweight file-sharing web app (React + Express/Mongo). Quicky provides a simple UI to upload files, generate short links / QR codes and download shared files. The repository contains two main parts:

- `backend/` — Express.js server, MongoDB (Mongoose) models, authentication and file upload handling.
- `frontend/` — Vite + React single-page app (pages: Home, Login, Register, Dashboard, Download).

This README explains how to install, run and troubleshoot the project locally.

## Prerequisites

- Node.js v16+ (recommended). Verify with `node -v`.
- npm (comes with Node.js). Verify with `npm -v`.
- A running MongoDB instance or a MongoDB connection string (Atlas or local).

## Quick install

Open a terminal at the repository root (`c:\Users\Desktop\Quicky`) and run the convenience script to install both frontend and backend dependencies:

```powershell
npm run install-all
```

This runs `npm install` inside both `backend/` and `frontend/`.

## Environment

Create a `.env` file inside `backend/` (next to `server.js`) with at least the following variables:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret-for-jwt>
```

Adjust values as needed. If you don't set `PORT`, the backend will default to the port configured in `server.js` (usually 5000).

## Run the app (development)

You typically run the backend and frontend in two terminals.

Terminal 1 — start backend (uses nodemon):

```powershell
cd backend
npm run dev
```

Terminal 2 — start frontend (Vite dev server):

```powershell
cd frontend
npm run dev
```

The frontend dev server runs on Vite's default (usually http://localhost:5173). The frontend expects the backend API to be reachable at the base URL configured in `frontend/src/utils/api.js`. If your backend runs on a different host/port, update that file or set the appropriate environment / proxy.

Alternatively you can run the helper scripts from the repository root:

```powershell
# start only backend (from repo root)
npm run backend

# start only frontend (from repo root)
npm run frontend
```

## Build for production (frontend)

```powershell
cd frontend
npm run build
```

After building, you can serve the static files with any static host (or wire them into the backend). Vite's `preview` command can serve the build locally for testing:

```powershell
cd frontend
npm run preview
```

## Helpful scripts (root `package.json`)

- `npm run install-backend` — install backend deps
- `npm run install-frontend` — install frontend deps
- `npm run install-all` — install both
- `npm run backend` — start backend (`npm start` inside `backend`)
- `npm run frontend` — start frontend dev server

## Troubleshooting

- Blank white screen in browser:
  - Open the browser devtools (F12) and check the Console for runtime errors. A missing or broken React component import will typically show an error there.
  - Check the Network tab for 404s or failed API calls.
  - Make sure the frontend dev server is running (`npm run dev` inside `frontend`) and that the backend API base URL in `frontend/src/utils/api.js` points to the running backend.

- Backend connection/auth errors:
  - Ensure `MONGODB_URI` in `backend/.env` is valid and reachable.
  - Check backend logs in the terminal running `npm run dev` for stack traces.

- Port already in use:
  - Change `PORT` in `backend/.env` or stop the process using the port.

## Project structure (short)

- `backend/`
  - `server.js` — app entry
  - `models/` — Mongoose models
  - `routes/` — Express routes
  - `middleware/` — auth and upload middleware

- `frontend/`
  - `index.html`, `src/main.jsx` — React entry
  - `src/App.jsx` — root app and routes
  - `src/pages/` — page components
  - `src/utils/api.js` — axios / API base URL

## Notes / Next steps

- If you still see a white screen after the above checks, copy the browser console and terminal error output into an issue and I can help diagnose further. Common fixes are missing component exports/imports, incorrect route names, or runtime exceptions in React lifecycle.

## License

MIT
