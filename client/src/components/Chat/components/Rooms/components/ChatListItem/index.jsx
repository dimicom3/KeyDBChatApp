import "./style.css";
import React, { useMemo } from "react";
import { useAppState } from "../../../../../../state";
import moment from "moment";
import { useEffect } from "react";
import { getMessages } from "../../../../../../services/user.service";
import StatusComponent from "../../../StatusComponent";
import { Row, Col } from "react-bootstrap";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};


const ChatListItem = ({ onClick,users, active = false, room}) => {
  const { id, name } = room;

  const [online] = useMemo(() => {
    try {
      const usersFiltered = Object.entries(users)
        .filter(([, user]) => user.username === name)
        .map(([, user]) => user);
      let online = false;
      if (usersFiltered.length > 0) {
        online = usersFiltered[0].online;
      }
      return [online];
    } catch (_) {
      return [false, false, "0"];
    }
  }, [id, name, users]);


  return(   
    <Row onClick={onClick} className={`chat-list-item d-flex align-items-start ${active ? "bg-white" : ""}`}>

      <Col className="align-self-center mr-2 col-1">
        <StatusComponent online={online} hide={room.id === "0"} />
      </Col>

      <Col className="media-body overflow-hidden col-9">
        <h5 className="text-truncate font-size-15 mb-1">{name}</h5>
      </Col>

    </Row>
  );

}

export default ChatListItem;
