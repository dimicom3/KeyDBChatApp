import moment from "moment";
import { compareValues, hashValue } from "../utils/crypt";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
  constructor() {
    super();
  }

  // Get rooms associated with a user
  async getRoomsForUser(id: string) {
    const roomIds = await this.keyDB.sMembers(`user:${id}:rooms`);
    const rooms = [];

    for (const roomId of roomIds) {
      let name = await this.keyDB.get(`room:${roomId}:name`);

      if (!name) {
        const userIds = roomId.split(":");
        if (userIds.length !== 2) {
          throw new ApplicationError("Error: Invalid user ID format");
        }

        rooms.push({
          id: roomId,
          names: [
            await this.keyDB.hmGet(`user:${userIds[0]}`, "username"),
            await this.keyDB.hmGet(`user:${userIds[1]}`, "username"),
          ],
        });
      } else {
        rooms.push({ id: roomId, names: [name] });
      }
    }

    return rooms;
  }

  // Get information about multiple users by their IDs
  async getListOfUsersInfo(ids: any) {
    if (Array.isArray(ids)) {
      const users:any = {};

      for (const id of ids) {
        const user = await this.keyDB.hGetAll(`user:${id}`);
        users[id] = {
          id,
          username: user.username,
          online: !!(await this.keyDB.sIsMember("users/active", `${id}`)),
        };
      }

      return users;
    }
  }

  // Get information about online users
  async getOnlineUsers() {
    const onlineIds = await this.keyDB.sMembers(`users/active`);
    const users:any = {};
  
    for (const onlineId of onlineIds) {
      const user = await this.keyDB.hGetAll(`user:${onlineId}`);
      users[onlineId] = {
        id: onlineId,
        username: user.username,
        online: true,
      };
    }

    return users;
  }

  // Get information about all users
  async getAllUsers() {
    const total_keys = await this.keyDB.get("users/all") as unknown;
    const users = [];

    for (let user_key = 1; user_key <= (total_keys as number); user_key++) {
      const user = await this.keyDB.hGetAll(`user:${user_key}`);
      users.push({
        id: user_key,
        username: user.username,
      });
    }

    return users;
  }

  // Get messages for a room
  async getMessages(roomId = "0", offset = 0, size = 30) {
    const roomKey = `room:${roomId}`;
    const roomExists = await this.keyDB.exists(roomKey);

    if (!roomExists) {
      throw new ApplicationError("Room doesn't exist");
    }

    let messages = await this.keyDB.zRange(roomKey, 0, -1);
    messages = messages.map((msg) => JSON.parse(msg)).reverse();
    return messages;
  }

  // Alternative method to get messages for a room
  async getMessages_alt(roomId = "0", offset = 0, size = 30) {
    const roomKey = `room:${roomId}`;
    const messageKeys = await this.keyDB.keys(`${roomKey}:*message:*`);

    // Sort the message keys by timestamp if necessary
    messageKeys.sort(); // You may need to implement custom sorting logic

    // Fetch messages using the message keys
    const messages = await Promise.all(messageKeys.map(async (messageKey) => {
      const messageString = await this.keyDB.get(messageKey);
      return messageString ? JSON.parse(messageString) : null;
    }));

    return messages;
  }

  // Create a room between two users
  async createRoom(user1: any, user2: any) {
    const minUserId = Math.min(user1, user2);
    const maxUserId = Math.max(user1, user2);
    const room_id = `${minUserId}:${maxUserId}`;

    if (!room_id) {
      throw new ApplicationError({ ...httpErrorTypes.BAD_REQUEST, message: "Invalid room_id" });
    }

    await this.keyDB.sAdd(`user:${user1}:rooms`, room_id);
    await this.keyDB.sAdd(`user:${user2}:rooms`, room_id);

    return {
      id: room_id,
      names: [
        await this.keyDB.hmGet(`user:${user1}`, "username"),
        await this.keyDB.hmGet(`user:${user2}`, "username"),
      ],
    };
  }

  // User login
  async login(username: string, password: string) {
    const usernameKey = `username:${username}`;
    const user = await this.keyDB.exists(usernameKey);

    if (!user) {
      return await this.create(username, password);
    } else {
      const userKey = await this.keyDB.get(usernameKey);

      if (!userKey) throw new ApplicationError("User data not found");

      const data = await this.keyDB.hGetAll(userKey);

      if (await compareValues(password, data.password)) {
        const user = { id: userKey.split(":").pop(), username };
        return user;
      }
    }
  }

  // Create a new user
  async create(username: string, password: string) {
    const usernameKey = `username:${username}`;
    const hashedPassword = await hashValue(password);
    const nextId = await this.keyDB.incr("users/all");

    const userKey = `user:${nextId}`;
    await this.keyDB.set(usernameKey, userKey);
    await this.keyDB.hSet(userKey, { username, password: hashedPassword });
    await this.keyDB.sAdd(`user:${nextId}:rooms`, `${0}`); // Main room

    return { id: nextId, username };
  }
}
