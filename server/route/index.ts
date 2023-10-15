import { Express, NextFunction } from "express";
import userRoute from "./user.route";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import * as ErrorController from "../controller/error.controller"

export default function (app: Express) { 
    app.use("/users", userRoute);
    // app.use("/post", postRoute);
    // app.use("/auth", authRoute);
    // app.use("/community", communityRoute);
    // app.use("/comment", commentRoute);
    
    // app.use((req, res, next) => {
    //     next();
    // });
    app.use(ErrorController.errorHandler); 
}