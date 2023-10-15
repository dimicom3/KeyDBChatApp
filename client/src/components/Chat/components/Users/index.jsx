import React, { useEffect, useState } from "react";
import { useAppState } from "../../../../state";
import { addRoom, getAllUsers } from "../../../../services/user.service";
import { Col, Row, InputGroup, FormControl, ListGroup, Button, Container } from "react-bootstrap";

const Users = ({ dispatch, userProp, onMessageSend }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [state] = useAppState();

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onClick = async (user1_id, user2_id) => {
    const result = await addRoom(user1_id, user2_id);
    console.log(result.id);
    onMessageSend("Hello!", result.id, 99999999);
    window.location.reload(false);
  };

  return (
    <Container className="chat-list-container flex-column d-flex pr-4">
      <div className="py-2">
        <p className="h5 mb-0 py-1 chats-title">Search for a user</p>
      </div>
      <div className="messages-box flex flex-1">
        <div className="search-bar">
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <Container>
          {filteredUsers.map((user) => {
            return user.id != userProp.id ? (
              <Row key={user.id} className="p-2 border-bottom" style={{}} >
                <Col className="cursor-pointer" style={{cursor:'pointer'}} onClick={() => onClick(userProp.id, user.id)}> <h5>{user.username}</h5></Col>
              </Row>
            ) : null;
          })}
        </Container>
      </div>
    </Container>
  );
};

export default Users;
