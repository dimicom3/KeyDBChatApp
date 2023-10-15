import React, { useEffect, useCallback } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { getOnlineUsers, getRooms } from "./services/user.service";
import useAppStateContext, { AppContext } from "./state";
import moment from "moment";
import { useSocket, useUser } from "./utility";
import { Navbar, Row, Container, Stack } from "react-bootstrap";

const App = () => {
  const [state, dispatch] = useAppStateContext();
  const onUserLoaded = useCallback(
    (user) => {
      if (user !== null) {
        if (!state.users[user.id]) {
          dispatch({ type: "set user", payload: { ...user, online: true } });
        }
      }
    },
    [dispatch, state.users]
  );

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

  const { user, onLogIn, onLogOut, loading } = useUser(onUserLoaded, dispatch);
  const [socket, connected] = useSocket(user, dispatch);

  useEffect(() => {
    if (user === null) return;
    if (connected) {

      const newRooms = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: true });
        socket.emit("room.join", room.id);
      });
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    } else {

      const newRooms = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (!room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: false });
      });
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    }
  }, [user, connected, dispatch, socket, state.rooms, state.users]);

  useEffect(() => {
    if (Object.values(state.rooms).length === 0 && user !== null) {
      getOnlineUsers().then((users) => {
        dispatch({
          type: "add users",
          payload: users,
        });
      });
      getRooms(user.id).then((rooms) => {
        const payload = [];
        rooms.forEach(({ id, names }) => {
          payload.push({ id, name: room_name_transform(names, user.username) });
        });
        dispatch({
          type: "set rooms",
          payload,
        });
        dispatch({ type: "set current room", payload: "0" });
      });
    }
  }, [dispatch, state.rooms, user]);

  const onMessageSend = useCallback(
    (message, roomId, expSec) => {
      if (typeof message !== "string" || message.trim().length === 0)  return;
      
      if (!socket) {
        console.error("Couldn't send message");
      }
      socket.emit("message", {
        roomId: roomId,
        message,
        from: user.id,
        expSec: expSec,
        date: moment(new Date()).unix(),
      });
    },
    [user, socket]
  );

  if (loading) {
    return (
      <div className="centered-box">
        <div className="spinner-border" role="status">
          <span className="visually-hidden" />
        </div>
      </div>
   );
  }

  const showLogin = !user;

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <div className={`full-height `} style={{backgroundColor:"#0F4C75"}}>
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-body-tertiary " style={{backgroundColor:"#1B262C"}}>
          <Container>
            <Navbar.Brand href="#home">KeyDB chat app</Navbar.Brand>
            <Navbar.Toggle />
            {!showLogin &&(
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text style={{fontSize:"16px"}}>
                {user.username}
              </Navbar.Text>
              
              <Navbar.Text xs={4}  className="text-danger ml-3" style={{ cursor: "pointer" }} onClick={onLogOut}>
                Log out
              </Navbar.Text>
            </Navbar.Collapse>
            )}
          </Container>
        </Navbar>
        {showLogin ? (
          <Login onLogIn={onLogIn} />
        ) : (
          <Chat user={user} onMessageSend={onMessageSend} onLogOut={onLogOut} />
        )}
      </div>
    </AppContext.Provider>
  );
};


export default App;
