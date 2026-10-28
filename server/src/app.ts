import cors from "cors";
import express from "express";
import path from "path";
import { sessionMiddleware } from "./middleware/session";
import routes from "./routes";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
} else {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    }),
  );
}

app.use(express.json({ limit: "100kb" }));
app.use(sessionMiddleware);
app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

if (isProduction) {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
