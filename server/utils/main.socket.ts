// import SocketInterface from "./socketInterface";
// import { Socket} from "socket.io";
// import { DefaultEventsMap } from "socket.io/dist/typed-events";
// import { keyDB } from "../db";
// import { RedisClientType } from "redis";
// import dotenv from "dotenv";

// dotenv.config();


// class MainSocket implements SocketInterface
// {
//     redisDriver: RedisClientType;

//     constructor()
//     {
//         this.redisDriver = keyDB.client;
//     }

//         const ipAddress = require('ip').address();
//         const port = process.env.SERVER_PORT || 5000;

//         const payload = {
//           serverId: `${ipAddress}:${port}`,
//           type,
//           data,
//         };
//     };
      
//     async handleConnection(socket: any){
//       let io = Websocket.getInstance()

//             if (socket.request.session.user === undefined) {
//               return;
//             }
//             const userId = socket.request.session.user.id;
//             await this.redisDriver.sAdd("users/active", `${userId}`);
        
//             const msg = {
//               ...socket.request.session.user,
//               online: true,
//             };
        
//             socket.broadcast.emit("user.connected", msg);
        
//             socket.on("room.join", (id:string) => {
//               socket.join(`room:${id}`);
//             });
        
//             socket.on(
//               "message",
//               /**
//                * 
//                *  from: string
//                *  date: number
//                *  message: string
//                *  roomId: string
//                * 
//                **/
//               async (message: any) => {

//                 message = { ...message, message: message.message };//provera poruke potrebna

//                 await this.redisDriver.sAdd("users/active", `${message.from}`);
//                 /** We've got a new message. Store it in db, then send back to the room. */
//                 const messageString = JSON.stringify(message);
//                 const roomKey = `room:${message.roomId}`;
//                 /**
//                  * It may be possible that the room is private and new, so it won't be shown on the other
//                  * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
//                  */
//                 const isPrivate = !(await this.redisDriver.exists(`${roomKey}:name`));
//                 const roomHasMessages = await this.redisDriver.exists(roomKey);
//                 if (isPrivate && !roomHasMessages) {
//                   const ids = message.roomId.split(":");
//                   const msg = {
//                     id: message.roomId,
//                     names: [
//                       await this.redisDriver.hmGet(`user:${ids[0]}`, "username"),
//                       await this.redisDriver.hmGet(`user:${ids[1]}`, "username"),
//                     ],
//                   };
//              
//                   socket.broadcast.emit(`show.room`, msg);
//                 }
//                 await (this.redisDriver as any).zAdd(roomKey,{score: "" + message.date ,value: messageString});
//                 io.to(roomKey).emit("message", message);
//               }
//             );
//             socket.on("disconnect", async () => {
//               const userId = socket.request.session.user.id;
//               await this.redisDriver.sRem("users/active", `${userId}`);
//               const msg = {
//                 ...socket.request.session.user,
//                 online: false,
//               };
//               socket.broadcast.emit("user.disconnected", msg);
//             });
          
//     }
//     middlewareImplementation?(socket: Socket, next: any) {
//       return next();
//     }
    
// }

// export default MainSocket;