# EcoCycle Mock REST API

`db.json` provides sample users and e-waste requests. Start the mock API on port `8080` (the port used by the frontend):

```sh
npm install
npm run mock-api
```

Use these URLs in Postman:

| Method | URL | Purpose |
| --- | --- | --- |
| GET | `http://localhost:8080/api/admin/requests` | List all e-waste requests |
| GET | `http://localhost:8080/api/users/1/requests` | List requests for user 1 |
| GET | `http://localhost:8080/api/ewaste/101` | Get one request |
| POST | `http://localhost:8080/api/ewaste` | Create a request |
| PUT | `http://localhost:8080/api/admin/requests/101/status` | Update a request |
| DELETE | `http://localhost:8080/api/ewaste/101` | Delete a request |
| GET | `http://localhost:8080/api/admin/users` | List users |

For POST, set `Content-Type: application/json` and send:

```json
{
  "userId": 1,
  "userName": "EcoCycle User",
  "deviceName": "Old Monitor",
  "category": "Computers",
  "quantity": 1,
  "condition": "Not Working",
  "weight": 4.5,
  "description": "Screen is damaged.",
  "status": "Pending",
  "createdAt": "2026-10-04T10:00:00.000Z"
}
```

The status update endpoint accepts JSON such as `{ "status": "Accepted" }`. JSON Server persists changes in `db.json`. This mock API is the local API used by the project.
