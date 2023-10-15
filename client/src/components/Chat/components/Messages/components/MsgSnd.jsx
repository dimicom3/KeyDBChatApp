import moment from "moment";
import React from "react";
import StatusComponent from "../../StatusComponent";

const MsgSnd = ({
  user,
  message = "...",
  date,
  onUserClicked,
}) => (
  <div className="d-flex">
    <div style={{ width: "50%" }} className="text-left mb-4">
      <div
        className="conversation-list d-inline-block px-3 py-2"
        style={{backgroundColor: "#c7eaec" }}
      >
        <div className="ctext-wrap">
          {user && (
            <div className="conversation-name text-primary d-flex align-items-center mb-1">
              <div className="mr-2" style={{ fontWeight: 600, cursor: "pointer", }} onClick={onUserClicked}> {user.username}</div>
              <StatusComponent width={7} height={7} online={user.online} />
            </div>
          )}
          <p className="text-left">{message}</p>
          <p className="chat-time mb-0">{moment.unix(date).format("LT")}</p>
        </div>
      </div>
    </div>
    <div style={{ flex: 1 }} />
  </div>
);

export default MsgSnd;
