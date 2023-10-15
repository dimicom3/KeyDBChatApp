import { useEffect, useRef, useState } from "react";
import { getInfo, login, logOut } from "./services/user.service";
import io from "socket.io-client";

const room_name_transform = (names, username) => {
  for (let name of names) {
    if (typeof name !== 'string') {
      name = name[0];
    }
    if (name !== username) {
      return name;
    }
  }
  return names[0];
};

const updateUser = (newUser, dispatch, infoMessage) => {
  dispatch({ type: "set user", payload: newUser });
  if (infoMessage !== undefined) {
    dispatch({
      type: "add message",
      payload: {
        id: "0",
        message: {
          date: Math.random() * 10000,
          from: "info",
          message: infoMessage,
        },
      },
    });
  }
};

const useSocket = (user, dispatch) => {
  const socketRef = useRef(null);
  const socket = socketRef.current;
  const [connected, setConnected] = useState(false);


  useEffect(() => {
    if (user === null) {
      if (socket !== null) {
        socket.disconnect();
      }
      setConnected(false);
    } else {
      if (socket !== null) 
        socket.connect();
      else 
        socketRef.current = io();
      setConnected(true);
    }
  }, [user, socket]);

  useEffect(() => {
    if (connected && user) {
      socket.on("user.connected", (newUser) => {
        updateUser(newUser, dispatch, `${newUser.username} connected`);
      });
      socket.on("user.disconnected", (newUser) =>
        updateUser(newUser, dispatch, `${newUser.username} left`)
      );
      socket.on("show.room", (room) => {
        console.log({ user });
        dispatch({
          type: "add room",
          payload: {
            id: room.id,
            name: room_name_transform(room.names, user.username),
          },
        });
      });
      socket.on("message", (message) => {
        dispatch({
          type: "activate user",
          payload: message.from,
        });
        dispatch({
          type: "add message",
          payload: { id: message.roomId === undefined ? "0" : message.roomId, message },
        });
      });
    } else {
      if (socket) {
        socket.off("user.connected");
        socket.off("user.disconnected");
        socket.off("user.room");
        socket.off("message");
      }
    }
  }, [connected, user, dispatch, socket]);

  return [socket, connected];
};

const useUser = (onUserLoaded = (user) => { }, dispatch) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const onLogIn = (
    username = "",
    password = "",
    onError = (val = null) => { },
    onLoading = (loading = false) => { }
  ) => {
    onError(null);
    onLoading(true);
    login(username, password)
      .then((x) => {
        console.log("setUSER", x)
        setUser(x);
      })
      .catch((e) => onError(e.message))
      .finally(() => onLoading(false));
  };

  const onLogOut = async () => {
    logOut().then(() => {
      setUser(null);
      dispatch({ type: "clear" });
      setLoading(true);
    });
  };

  useEffect(() => {
    if (!loading) {
      return;
    }
    getInfo().then((user) => {
      setUser(user);
      setLoading(false);
      onUserLoaded(user);
    });
  }, [onUserLoaded, loading]);

  return { user, onLogIn, onLogOut, loading };
};

export {
  useSocket,
  useUser
};