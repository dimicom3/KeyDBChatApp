import moment from "moment";
import React from "react";

function formatTimeDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const MsgRec = ({
  username = "",
  message = "...",
  date,
  type,
  TTL,
}) => (
  <div className="d-flex">
    <div style={{ flex: 1 }} />
    <div style={{ width: "55%" }} className="text-right mb-4">
      <div className="conversation-list d-inline-block bg-light px-3 py-2" >
        <div className="ctext-wrap">
        <div className="conversation-name text-primary d-flex align-items-center mb-1">
            <div className="mr-2" style={{ fontWeight: 600, cursor: "pointer", }}> {username}</div>
            { (TTL < 3600) &&
                <> 
                <div className="ml-2"> <svg xmlns="http://www.w3.org/2000/svg" height="0.8em" fill="#495057" viewBox="0 0 384 512"><path d="M0 32C0 14.3 14.3 0 32 0H64 320h32c17.7 0 32 14.3 32 32s-14.3 32-32 32V75c0 42.4-16.9 83.1-46.9 113.1L237.3 256l67.9 67.9c30 30 46.9 70.7 46.9 113.1v11c17.7 0 32 14.3 32 32s-14.3 32-32 32H320 64 32c-17.7 0-32-14.3-32-32s14.3-32 32-32V437c0-42.4 16.9-83.1 46.9-113.1L146.7 256 78.9 188.1C48.9 158.1 32 117.4 32 75V64C14.3 64 0 49.7 0 32zM96 64V75c0 25.5 10.1 49.9 28.1 67.9L192 210.7l67.9-67.9c18-18 28.1-42.4 28.1-67.9V64H96zm0 384H288V437c0-25.5-10.1-49.9-28.1-67.9L192 301.3l-67.9 67.9c-18 18-28.1 42.4-28.1 67.9v11z"/></svg></div>
                <div className="ml-1" style={{fontSize: 12, color:"#495057", width:"2em"}}>{formatTimeDuration(TTL)}</div>
                </>
              }
          </div>
          {type == "text" && (<p className="text-left">{message}</p>)}
          {type == "image" && (<p className="text-left">  <img src= {`data:image/png;base64, ${message}`} alt="Red dot" style={{ width: "100%", height: "100%" }} /></p>)}

          <p className="chat-time mb-0">{moment.unix(date).format("LT")}</p>

        </div>
      </div>
    </div>
  </div>
);
export default MsgRec;
