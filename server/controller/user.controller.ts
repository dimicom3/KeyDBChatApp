import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service";
import { sendResponse } from "../utils/response";
import * as ExpressSession from 'express-session';
import ApplicationError from "../utils/error/application.error";
import { type } from "os";
//import { Request } from "./Request";


const userService = new UserService();

export class UserController {
    
    async login(req: Request, res: Response, next: NextFunction)
    {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const payload = await userService.login(username, password);
            (req as any).session.user = payload;
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction)
    {
        try {
            req.session.destroy(() => {})
            return sendResponse(res, {});
        } catch (error) {
            next(error);
        }
    }

    async createRoom(req: Request, res: Response, next: NextFunction){
        try{
            const { user1, user2 } = {
                user1: parseInt(req.body.user1),
                user2: parseInt(req.body.user2),
            };
            const payload = await userService.createRoom(user1, user2);
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }


    async getMessages(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.id;
            const offset = +!req.query.offset;
            const size = +!req.query.size;
            
            const messages = await userService.getMessages(roomId, offset, size);
            
            return sendResponse(res, messages);
        }
        catch (error) {
            next(error);
        }
    }

    async getOnlineUsers(req: Request, res: Response, next: NextFunction){
        try{
            const payload = await userService.getOnlineUsers()
            return sendResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
      }
      async getAllUsers(req: Request, res: Response, next: NextFunction){
        try{
            const payload = await userService.getAllUsers()
            return sendResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
      }

    async getListOfUsersInfo(req: Request, res: Response, next: NextFunction){
        try{
            const ids = req.query.ids;
            const payload = await userService.getListOfUsersInfo(ids);
            return sendResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
    }

    async getRoomsForUser(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId;
            const payload = await userService.getRoomsForUser(userId)
            return sendResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
    }

}
