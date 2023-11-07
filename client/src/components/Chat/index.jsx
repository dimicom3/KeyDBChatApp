import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Rooms from "./components/Rooms";
import Messages from "./components/Messages";
import Users from "./components/Users";
import { useAppState } from "../../state";
import { addRoom, getMessages } from "../../services/user.service";
import { useCallback } from "react";
import { useEffect, useRef } from "react";
import { getUsers } from "../../services/user.service";

export default function Chat({ onLogOut, user, onMessageSend }) {
  const [state, dispatch] = useAppState();
  const messageListElement = useRef(null);
  const [showUploadFile, setShowUploadFile] = useState(false)

  const socketRef = useRef(null);
  const socket = socketRef.current;


  const room = state.rooms[state.currentRoom];
  const roomId = room?.id;
  const messages = room?.messages;

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
  const [test, setTest] = useState(true)

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      if (messageListElement.current) {
        messageListElement.current.scrollTop = 0;
      }
    }, 0);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messageListElement.current) {
      messageListElement.current.scrollTo({
        top: messageListElement.current.scrollHeight,
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const get_useres_msgs = async (users, dispatch, messages) => {
    const userIds = {};
    messages.forEach((message) => {
      userIds[message.from] = 1;
    });
  
    const ids = Object.keys(userIds).filter(
      (id) => users[id] === undefined
    );
  
    if (ids.length !== 0) {
      const newUsers = await getUsers(ids);
      dispatch({
        type: "add users",
        payload: newUsers,
      });
    }
  
  };

  const onFetchMessages = useCallback(
    (offset = 0) => {
      getMessages(roomId, offset).then(async (messages) => {
        if(messages){
          await get_useres_msgs(state.users, dispatch, messages);
          dispatch({
            type:  "set messages",
            payload: { id: roomId, messages: messages },
          });
        
          scrollToBottom();
        }
      });
    },
    [dispatch, roomId, scrollToBottom, scrollToTop, state.users]
  );

  useEffect(() => {

    if (roomId === undefined) {
      return;
    }
    if (messages === undefined) {
      onFetchMessages();
    }
  }, [
    messages,
    dispatch,
    roomId,
    state.users,
    state,
    scrollToBottom,
    onFetchMessages,
  ]);

  useEffect(() => {
    if (messageListElement.current) {
      scrollToBottom();
    }
  }, [scrollToBottom, roomId]);

  const onUserClicked = async (userId) => {
    const targetUser = state.users[userId];
    let roomId = targetUser.room;
    if (roomId === undefined) {
      const room = await addRoom(userId, user.id);
      roomId = room.id;
      dispatch({ type: "set user", payload: { ...targetUser, room: roomId } });
      dispatch({
        type: "add room",
        payload: { id: roomId, name: room_name_transform(room.names, user.username) },
      });
    }
    dispatch({ type: "set current room", payload: roomId });
  };

  const onLoadMoreMessages = useCallback(() => {
    onFetchMessages(room.offset, true);
  }, [onFetchMessages, room]);


  const [expSec, setExpSec] = useState(60)
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");


  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };


  const onSubmit= (e) => {
              e.preventDefault();
              if(message){
                onMessageSend(message.trim(), roomId, expSec, "text");
                setMessage("");
                onMessageSend("", 0, 0)
                messageListElement.current.scrollTop =
                  messageListElement.current.scrollHeight;
                setTimeout(() => {
                  messageListElement.current.scrollTop =
                  messageListElement.current.scrollHeight;
                }, 100);
              }
              if(selectedImage)
              {
                const reader = new FileReader();
                reader.onload = function(){
                  
                  // Use socket.io to send the image data
                  // socket.emit('image', { imageData: e.target.result, filename: selectedImage.name });
                  const base64 = this.result.replace(/.*base64,/, '');
                  onMessageSend(base64, roomId, expSec, "image");

                };
                //reader.readAsArrayBuffer(selectedImage)
                reader.readAsDataURL(selectedImage)
                setSelectedImage(null);
                onMessageSend("", 0, 0)
                messageListElement.current.scrollTop =
                  messageListElement.current.scrollHeight;
                setTimeout(() => {
                  messageListElement.current.scrollTop =
                  messageListElement.current.scrollHeight;
                }, 100);
                setShowUploadFile(false)

              }
            };

  return (
    <Container className="py-5 px-4">
      <Row className="overflow-hidden shadow bg-light chat-body">

        <Col xs={3} className="px-0">
          <Rooms
            user={user}
            onLogOut={onLogOut}
            users={state.users}
            rooms={state.rooms}
            currentRoom={state.currentRoom}
            dispatch={dispatch}
          />
        </Col>
        {/* Chat Box*/}
        <Col xs={6} className="px-0 flex-column bg-white">
          <div className="px-4 py-4" style={{ borderBottom: "1px solid #eee" }}>
            <h2 className="font-size-15 mb-0">{room ? room.name : "Room"}</h2>
          </div>
          <Messages
            messageListElement={messageListElement}
            messages={messages}
            room={room}
            onLoadMoreMessages={onLoadMoreMessages}
            user={user}
            onUserClicked={onUserClicked}
            users={state.users}
          />

          <div className="p-3 chat-input-section">
            <form className="row" encType="multipart/form-data" onSubmit={onSubmit} >
              
              <Col xs='1'><Button className="btin btn-secondary w-sm" onClick={() => {setShowUploadFile(!showUploadFile)}}>+</Button></Col>
              {
                !showUploadFile ? (
                  <Col  xs='5'>
                    <div className="position-relative">
                      <Form.Control
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className="form-control chat-input"
                      />
                    </div>
                  </Col>
                ) :
                (
                  <Col  xs='5'>
                    <input type="file" onChange={handleImageChange} accept="image/*" />
                  </Col>
                    )
              }
              <Col xs='2' className="mr-3 py-1">
              <select value={expSec} onChange={(event) => {setExpSec(event.target.value);}}>
                <option value={3600}>1 hour</option>
                <option value={1800}>30 minute</option>
                <option value={60}>1 minute</option>
                <option value={9999999999}>never</option>
              </select>
              </Col>

              <Col xs="auto">
                <Button type="submit" className="btn btn-secondary w-sm">Send</Button>
              </Col>
            </form>
          </div>
        </Col>
        <Col xs={3}>
          <Users  dispatch={dispatch} userProp={user} onMessageSend={onMessageSend} /> 
        </Col>

      </Row>
    </Container>
  );
}
