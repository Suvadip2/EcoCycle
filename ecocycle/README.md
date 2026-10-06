# EcoCycle

EcoCycle is a React frontend with a local JSON Server mock API.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

Open two PowerShell terminals in the project folder. In the first terminal, install dependencies if needed and start the mock API:

```powershell
npm install
npm run mock-api
```

In the second terminal, start the frontend:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Keep both terminals running. The mock API listens on `http://localhost:8080` and persists its data in `db.json`.

## Other commands

```powershell
npm run build
npm run lint
```

See [POSTMAN.md](./POSTMAN.md) for mock API endpoint examples.
