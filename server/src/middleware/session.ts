import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "../db/pool";

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
  throw new Error("SESSION_SECRET is required in production");
}

const PostgresStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PostgresStore({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  name: "blast_design_session",
  secret: sessionSecret || "development-only-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 8,
  },
});
