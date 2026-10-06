# EcoCycle

EcoCycle is an e-waste management project with a React frontend and a Kotlin/Spring Boot backend.

## Requirements

- Node.js and npm
- JDK 17
- MySQL

## Run the backend

1. Create a MySQL database named `ecocycle_db`.
2. Copy `backend/src/main/resources/application-example.properties` to `backend/src/main/resources/application.properties`.
3. Set your local database password in the copied file, or provide it through the `DB_PASSWORD` environment variable.
4. From the `backend` directory, run:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

The backend listens on `http://localhost:8080`.

## Run the frontend

In another terminal:

```powershell
cd ecocycle
npm ci
npm run dev
```

Open the local URL printed by Vite. The frontend expects the backend at `http://localhost:8080/api`.

## Checks

From `ecocycle`:

```powershell
npm run lint
npm run build
```

From `backend`:

```powershell
.\mvnw.cmd test
```

## Local mock API data

The optional JSON Server mock API uses `ecocycle/db.json`, which is intentionally excluded because it can contain local user data. To start with an empty database, copy `ecocycle/db.example.json` to `ecocycle/db.json`, then run `npm run mock-api` from `ecocycle`.
