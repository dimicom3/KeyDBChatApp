import moment from "moment";
import React from "react";

const MsgRec = ({
  username = "unknown",
  message = "...",
  date,
}) => (
  <div className="d-flex">
    <div style={{ flex: 1 }} />
    <div style={{ width: "55%" }} className="text-right mb-4">
      <div className="conversation-list d-inline-block bg-light px-3 py-2" >
        <div className="ctext-wrap">
          <div className="conversation-name text-left text-primary mb-1" style={{ fontWeight: 600,}}>
            {username}
          </div>
          <p className="text-left">{message}</p>
          <p className="chat-time mb-0">{moment.unix(date).format("LT")}</p>

        </div>
      </div>
    </div>
  </div>
);
export default MsgRec;
