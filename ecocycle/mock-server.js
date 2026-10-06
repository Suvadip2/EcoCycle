import jsonServer from "json-server";
import { readFile } from "node:fs/promises";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const routes = JSON.parse(await readFile(new URL("./routes.json", import.meta.url), "utf8"));

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((request, response, next) => {
  const statusRoute = request.url.match(/^\/api\/admin\/requests\/(\d+)\/status(?:\?.*)?$/);

  if (request.method === "PUT" && statusRoute) {
    request.method = "PATCH";
    request.url = `/ewaste/${statusRoute[1]}`;
  }

  next();
});
server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(8080, () => {
  console.log("EcoCycle mock REST API listening at http://localhost:8080");
});
