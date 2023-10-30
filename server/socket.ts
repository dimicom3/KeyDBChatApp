import { keyDB } from "./db";
import { Server } from "socket.io";


const initSocket = (io:Server) => {
    io.on("connection", async (socket: any) => {
        if (socket.request.session.user === undefined) return;
        
        const user_id = socket.request.session.user.id;
        await keyDB.client.sAdd("users/active", `${user_id}`);
        const msg = { ...socket.request.session.user, online: true,};

        socket.broadcast.emit("user.connected", msg);

        socket.on("room.join", (id:string) => { socket.join(`room:${id}`);  });

        socket.on("message",
        async (message: any) => {
  
            // await keyDB.client.sAdd("users/active", `${message.from}`);
            
            // const roomKey = `room:${message.roomId}`;
            
            // // Generate a unique message key based on room ID and user ID
            // const uniqueId = Math.floor(Math.random() * 1000000).toString()
            // const messageKey = `${roomKey}:${message.from}:message:${uniqueId}`;
            // console.log(message.expSec)
            // const expirationInSeconds = message.expSec; // Set the expiration time in seconds (e.g., 1 hour)
            
            // // Store the message with a TTL
            
            // const expirationTimestamp = new Date(Date.now() + expirationInSeconds * 1000);
            // message = {...message, expDate: expirationTimestamp}
            // const messageString = JSON.stringify(message);

            // await keyDB.client.setEx(messageKey, expirationInSeconds, messageString);
            
            // // Your existing code for broadcasting the message
            // io.to(roomKey).emit("message", message);
            
            //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            console.log(message)

            await keyDB.client.sAdd("users/active", `${message.from}`);
            const expirationInSeconds = message.expSec
            const expirationTimestamp = new Date(Date.now() + expirationInSeconds * 1000);
            message = {...message, expDate: expirationTimestamp}
            const messageString = JSON.stringify(message);
            const roomKey = `room:${message.roomId}`;
            console.log(message)
        
            const private_room = !(await keyDB.client.exists(`${roomKey}:name`));
            const has_messages = await keyDB.client.exists(roomKey);

            if (private_room && !has_messages) {
            const ids = message.roomId.split(":");
            const msg = {
                id: message.roomId,
                names: [
                await keyDB.client.hmGet(`user:${ids[0]}`, "username"),
                await keyDB.client.hmGet(`user:${ids[1]}`, "username"),
                ],
            };
            socket.broadcast.emit(`show.room`, msg);
            }

            await (keyDB.client as any).zAdd(roomKey,{score: "" + message.date,value: messageString});
            
            await keyDB.client.sendCommand(["EXPIREMEMBER", roomKey, messageString, expirationInSeconds.toString()])
            
            io.to(roomKey).emit("message", message);
        }
        );
        socket.on("disconnect", async () => {

            const user_id = socket.request.session.user.id;
            await keyDB.client.sRem("users/active", `${user_id}`);
            const msg = {
                ...socket.request.session.user,
                online: false,
            };
            socket.broadcast.emit("user.disconnected", msg);
        });
    })
}

export default initSocket
// async function purgeExpiredMessages() {
//   const currentUnixTime = Date.now();

//   // Get messages that have expired
//   await (keyDB.client as any).zRangeByScore("room:0", "-inf", currentUnixTime, async function(err: any, expiredMessages: any) {
//     if (err) {
//       console.error(err);
//     } else {
//       // Remove expired messages from the sorted set
//       if (expiredMessages.length > 0) {
//         await (keyDB.client as any).zRem("messages", ...expiredMessages, function(err: any, reply: any) {
//           if (err) {
//             console.error(err);
//           } else {
//             console.log(`Removed ${expiredMessages.length} expired messages.`);
//           }
//         });
//       }
//     }
//   });
// }
    
    // Schedule the worker to run every second
    // setInterval(async () => {await purgeExpiredMessages()}, 100)