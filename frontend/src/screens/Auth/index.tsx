import React, { useEffect, useState } from "react";
import styled from "styled-components";

import socket from "config/socket";
import ChatRoom from "screens/ChatRoom";

const Layout = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.article`
  height: 8rem;
  width: 15rem;
  padding: 2rem;
  margin-bottom: 10rem;
  border: 1px solid lightgrey;
  display: flex;
  align-items: center;
`;
const FormContainer = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const FormInput = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
`;

function Auth() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // LOG EVERY EVENT - DEBUG
    socket.onAny((event, ...args) => {
      console.warn("++++++++", event, args);
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsername("");
      }
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const onButtonClick = (event: any) => {
    event.preventDefault();
    if (username.length > 0) {
      socket.auth = { username };
      socket.connect();
      setShowChat(true);
    }
  };

  return (
    <>
      {showChat ? (
        <ChatRoom />
      ) : (
        <Layout>
          <Container>
            <FormContainer>
              <FormInput
                type="text"
                id="fname"
                name="fname"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                placeholder="Username"
              />
              <button onClick={onButtonClick}>Login</button>
            </FormContainer>
          </Container>
        </Layout>
      )}
    </>
  );
}

export default Auth;
