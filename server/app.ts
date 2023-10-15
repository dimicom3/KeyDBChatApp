import express from "express";
// import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import route from "./route/index" //da je imalo vise fajlova posto je putanja /index u liniji (route(app)) pozvace funkciju za taj fajl koja je default stavljenja.
dotenv.config(); //citanje promenljivih iz .env fajla
import sessionMiddleware from "./utils/sessionMiddleware";

const app = express();

app.use(express.urlencoded({extended: false})); //citanje JSON fajlova, deserijalizacija json podataka. client-> server. format(0,1); use za sve CRUD metode
app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);


// app.use(helmet({ contentSecurityPolicy: false })); //http header analogija; atributi headera analogija

route(app);

export default app;