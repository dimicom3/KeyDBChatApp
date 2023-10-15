import dotenv from "dotenv";
import app from "./app";
import http from "http";
import sessionMiddleware from "./utils/sessionMiddleware";
import { keyDB } from "./db";
import { KeyDB } from "./db/keydb.db";
import { Server } from "socket.io";
import initSocket from "./socket";

dotenv.config();

async function main()
{
    const port = process.env.SERVER_PORT || 5000; 
    const server = http.createServer(app); 

    console.log("\n");
    const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
    });


    server.listen(port, () => {  //callback f-ja
        console.log('\x1b[32m%s\x1b[0m', `Server started at ${port}...`);
    })
    initSocket(io)

    io.use((socket: any, next: any) => {  
        try {
        sessionMiddleware((socket.request as any), (socket.request as any).res || {}, (next as any));
      } catch (error: any) {
          console.error('Session middleware error:', error);
          next(error); 
        }
    });

    if(!await keyDB.client.exists("users/all") ){
      await keyDB.client.set("users/all", 0);
      await keyDB.client.set(`room:${0}:name`, "All");
    }

}

main();

