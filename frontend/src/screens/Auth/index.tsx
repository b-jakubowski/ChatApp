import React, { useEffect, useState } from "react";
import styled from "styled-components";
import socket from "../../socket";

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

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

function Auth() {
  const [isUserConnected, setIsUserConnected] = useState(socket.connected);

  useEffect(() => {
    // socket.on("connection", () => {
    //   setIsUserConnected(true);
    // });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    socket.on("disconnect", () => {
      setIsUserConnected(false);
    });

    socket.on(NEW_CHAT_MESSAGE_EVENT, (msg) => {
      console.log("++++", msg);
    });

    return () => {
      socket.off("connection");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Layout>
      <Container>
        <FormContainer>
          <form>
            <FormInput
              type="text"
              id="fname"
              name="fname"
              placeholder="Username"
            />
          </form>
          <button onClick={() => socket.emit(NEW_CHAT_MESSAGE_EVENT, "bbbb")}>
            Login
          </button>
        </FormContainer>
      </Container>
    </Layout>
  );
}

export default Auth;
