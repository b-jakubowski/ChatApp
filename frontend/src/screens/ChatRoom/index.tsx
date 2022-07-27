import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";

import socket from "config/socket";
import { User } from "interfaces/User";
import UserList from "components/UserList";
import ActiveUser from "components/ActiveUser";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";
import { usersReducer } from "./usersReducer";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const MessagesContainer = styled.div`
  display: flex;
  flex: 20;
  flex-direction: column;
`;

const ChatRoom = () => {
  const [users, dispatch] = useReducer(usersReducer, []);
  const [activeUserIndex, setActiveUserIndex] = useState(0);

  const activeUser = users[activeUserIndex];

  // TODO: Refactor below to custom hook
  useEffect(() => {
    socket.on("users", (usersLogged: User[]) => {
      const usersSorted = usersLogged
        .map((u) => ({
          ...u,
          messages: [],
          self: u.userID === socket.id,
          connected: true,
        }))
        .sort((a: any, b: any) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });

      dispatch({ type: "ADD_USERS", payload: [...usersSorted] });
    });

    socket.on("private message", ({ content, from }) => {
      dispatch({ type: "ADD_PRIVATE_MESSAGE", payload: { from, content } });
    });

    socket.on("user connected", (user) => {
      dispatch({
        type: "ADD_USER",
        payload: { ...user, messages: [], self: false, connected: true },
      });
    });

    socket.on("user disconnected", (userID) => {
      dispatch({ type: "DISCONNECT_USER", payload: { userID } });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, []);

  const onMessageSend = (message: string) => {
    if (!!activeUser) {
      socket.emit("private message", {
        content: message,
        to: activeUser.userID,
      });

      dispatch({
        type: "ADD_SELF_MESSAGE",
        payload: { activeUserId: activeUser.userID, message },
      });
    }
  };

  return (
    <Container>
      <UserList
        users={users}
        activeUser={activeUser}
        onUserClick={(index) => setActiveUserIndex(index)}
      />
      <ChatContainer>
        <ActiveUser username={activeUser?.username} />
        <MessagesContainer>
          {!!activeUser && !!activeUser.messages && (
            <MessageList
              messages={activeUser.messages}
              username={activeUser.username}
            />
          )}
          <MessageInput onMessageSend={onMessageSend} />
        </MessagesContainer>
      </ChatContainer>
    </Container>
  );
};

export default ChatRoom;
