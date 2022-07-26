import React, { KeyboardEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import socket from "../../socket";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;
const UserListContainer = styled.div`
  flex: 1;
  background-color: rgb(47, 26, 48);
`;
const ChatContainer = styled.div`
  flex: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: lightblue;
`;
const Dot = styled.span`
  height: 10px;
  width: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: inline-block;
`;

interface User {
  userID: string;
  username: string;
  self: boolean;
  connected: boolean;
  messages: Message[];
}

interface Message {
  from: string;
  content: string;
  fromSelf: boolean;
}

function ChatRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [message, setMessage] = useState("");

  const activeUser = users[activeUserIndex];

  useEffect(() => {
    socket.on("users", (usersLogged: User[]) => {
      setUsers(
        usersLogged
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
          })
      );
    });

    socket.on("private message", ({ content, from }) => {
      setUsers((prevState) =>
        prevState.map((u) => {
          if (from === u.userID) {
            const newMessage = {
              from,
              fromSelf: false,
              content,
            };
            const messages = !!u.messages
              ? [...u.messages, newMessage]
              : [newMessage];
            return {
              ...u,
              messages,
            };
          }
          return u;
        })
      );
    });

    socket.on("user connected", (user) => {
      setUsers((prevState) => [
        ...prevState,
        { ...user, messages: [], self: false, connected: true },
      ]);
    });

    socket.on("user disconnected", (id) => {
      setUsers((prevState) =>
        prevState.map((user) => {
          if (user.userID === id) {
            return { ...user, connected: false };
          }
          return user;
        })
      );
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

  const onMessageSend = () => {
    if (!!activeUser) {
      socket.emit("private message", {
        content: message,
        to: activeUser.userID,
      });

      setUsers((prevState) =>
        prevState.map((u) => {
          if (u.userID === activeUser.userID) {
            const newMessage = {
              from: socket.id,
              fromSelf: true,
              content: message,
            };
            const messages = !!u.messages
              ? [...u.messages, newMessage]
              : [newMessage];
            return {
              ...u,
              messages,
            };
          }
          return u;
        })
      );
      setMessage("");
    }
  };

  const onInputKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      onMessageSend();
      event.preventDefault();
    }
  };

  return (
    <Container>
      <UserListContainer>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {users.length > 0 &&
            users.map((user: User, i: number) => (
              <li
                key={`${user.userID}-${user.username}`}
                onClick={() => setActiveUserIndex(i)}
                style={{
                  color: "white",
                  backgroundColor:
                    activeUser?.userID === user.userID ? "blue" : "inherit",
                  padding: 10,
                  border: "1px solid grey",
                }}
              >
                <p>
                  {user.username}
                  {user.self && " (yourself)"}
                </p>
                <div>
                  {user.connected || user.self ? (
                    <p>
                      <Dot color="green" /> online
                    </p>
                  ) : (
                    <p>
                      <Dot color="red" /> offline
                    </p>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </UserListContainer>
      <ChatContainer>
        <div style={{ flex: 1, padding: 10, borderBottom: "1px solid grey" }}>
          <p>{users?.[activeUserIndex]?.username}</p>
        </div>
        <div
          style={{
            flex: 20,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "red",
          }}
        >
          <div style={{ flex: 7, backgroundColor: "yellow" }}>
            {!!users[activeUserIndex] &&
              users[activeUserIndex].messages.map((message: Message) => (
                <div key={nanoid()}>
                  <p>{message.fromSelf ? "(yourself)" : activeUser.username}</p>
                  <li>{message.content}</li>
                </div>
              ))}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              padding: 15,
              backgroundColor: "green",
            }}
          >
            <textarea
              id="w3review"
              name="w3review"
              style={{ width: "70%" }}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={onInputKeyPress}
            />
            <button onClick={onMessageSend}>Send</button>
          </div>
        </div>
      </ChatContainer>
    </Container>
  );
}

export default ChatRoom;
