import React, { useEffect, useMemo } from "react";
import ChatListItem from "./components/ChatListItem";
import { Container, ListGroup, ListGroupItem } from "react-bootstrap";

const Rooms = ({ rooms, dispatch, users, user, currentRoom, onLogOut }) => {
  const processedRooms = useMemo(() => {
    const roomsList = Object.values(rooms);
    const main = roomsList.find((x) => x.id === "0");
    let other = roomsList.filter((x) => x.id !== "0");
    other = other.sort(
      (a, b) => +a.id.split(":").pop() - +b.id.split(":").pop()
    );
    return main ? [main, ...other] : other;
  }, [rooms]);

  return (
    <Container className="chat-list-container flex-column d-flex pr-4">
      <div className="py-2">
        <p className="h4 mb-0 py-1 chats-title">Rooms:</p>
      </div>
      <div className="messages-box flex flex-1">
        <ListGroup>
          {processedRooms.map((room) => (
            <ChatListItem
              key={room.id}
              users={users}
              onClick={() =>
                dispatch({ type: "set current room", payload: room.id })
              }
              active={currentRoom === room.id}
              room={room}
            />
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default Rooms;
