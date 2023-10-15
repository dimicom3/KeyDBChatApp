import React, { useEffect, useState } from "react";
import { MESSAGES_TO_LOAD } from "../../../../services/user.service";
import MsgRec from "./components/MsgRec";
import MsgSnd from "./components/MsgSnd";
import {Card, Button } from "react-bootstrap";

const Messages = ({
  messageListElement,
  messages,
  room,
  onLoadMoreMessages,
  user,
  onUserClicked,
  users,
}) => {
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    // Function to filter out expired messages
    let isMounted = true;
    const filterExpiredMessages = () => {
      const currentTimestamp = Date.now();
      if (messages) {
        const filtered = messages.filter((message) => {
          // console.log(new Date(message.expDate));
          // console.log(new Date(currentTimestamp));
          // let expDate = new Date(message.expDate)
          if (message.expDate && new Date(message.expDate) <= new Date(currentTimestamp)) {
            // Message has expired
            return false;
          }
          return true;
        });
        setFilteredMessages(filtered);
      }
    };

    // Initial filter
    if (isMounted) filterExpiredMessages();

    // Set up a timer to periodically filter expired messages
    const refreshInterval = setInterval(() => {
      filterExpiredMessages();
    }, 1000); // Adjust the interval as needed (e.g., 60 seconds)

    // Cleanup on unmount
    return () => {
      clearInterval(refreshInterval);
    };
    return () => {
      isMounted = false;
    };
  }, [messages]);

  return (
    <div ref={messageListElement} className="chat-box-wrapper position-relative d-flex">
      {messages === undefined ? (
        <div className="no-messages flex-column d-flex flex-row justify-content-center align-items-center text-muted text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden" />
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="no-messages flex-column d-flex flex-row justify-content-center align-items-center text-muted text-center">
          <Card size={96} />
          <p>No messages</p>
        </div>
      ) : (
        <></>
      )}
      <div className="px-4 pt-5 chat-box position-absolute">
        {filteredMessages && filteredMessages.length !== 0 && (
          <>
            {room.offset && room.offset >= MESSAGES_TO_LOAD ? (
              <div className="d-flex flex-row align-items-center mb-4">
                <div style={{ height: 1, backgroundColor: "#eee", flex: 1 }}></div>
                <div className="mx-3">
                  <Button
                    aria-haspopup="true"
                    aria-expanded="true"
                    type="button"
                    onClick={onLoadMoreMessages}
                    className="btn rounded-button btn-secondary nav-btn"
                    id="__BVID__168__BV_toggle_"
                  >
                    Load more
                  </Button>
                </div>
                <div style={{ height: 1, backgroundColor: "#eee", flex: 1 }}></div>
              </div>
            ) : null
            }
            {filteredMessages.map((message, x) => {
              const key = message.message + message.date + message.from + x;
              if (message.from === "info") {
                return (
                  <p
                    className="mb-2 fs-6 fw-light fst-italic text-black-50 text-center"
                    style={{ opacity: 0.7, fontSize: 13 }}
                  >
                    {message.message}
                  </p>
                );
              }
              if (+message.from !== +user.id) {
                return (
                  <MsgSnd
                    onUserClicked={() => onUserClicked(message.from)}
                    key={key}
                    message={message.message}
                    date={message.date}
                    user={users[message.from]}
                  />
                );
              }
              return (
                <MsgRec
                  username={users[message.from] ? users[message.from].username : ""}
                  key={key}
                  message={message.message}
                  date={message.date}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
