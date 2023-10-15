import RedisStore from "connect-redis";
import session from "express-session";
import { keyDB } from "../db";

const sessionMiddleware = session({
    store: new RedisStore({ client: keyDB.client }),
    resave: true,
    secret: "123456qw",
    saveUninitialized: true,
  });
 
export default sessionMiddleware