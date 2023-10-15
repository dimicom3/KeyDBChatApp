import { Toast, Form, Button, Col, Row, Container } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import "./style.css";


export default function Login({ onLogIn }) {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    onLogIn(username, password, setError);
  };

  return (
      <Container className=" text-center login-page">
          <Form onSubmit={onSubmit} className="bg-white text-left px-4" style={{ paddingTop: 55}}>

            <Form.Group>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                id="inputUsername"
                placeholder="Username"
                required
              />            
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="inputPassword" className="font-size-12">
                Password:
              </Form.Label>
              <Form.Control
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                id="inputPassword"
                placeholder="Password"
                required
              />
            </Form.Group>
            <div style={{ height: 24 }}> </div>
            <Button className="btn-lg mb-5 btn-primary btn-block" type="submit">
              Sign in
            </Button>
            <div className="login-error-anchor">
              <div className="toast-box">
                <Toast
                  style={{ minWidth: 277 }}
                  onClose={() => setError(null)}
                  show={error !== null}
                  delay={3000}
                  autohide
                >
                  <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="mr-2"
                      alt=""
                    />
                    <strong className="mr-auto">Error</strong>
                  </Toast.Header>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>
              </div>
            </div>
          </Form>
      </Container>
  );
}

