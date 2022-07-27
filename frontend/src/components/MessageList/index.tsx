import React from "react";
import { nanoid } from "nanoid";
import styled from "styled-components";

import { Message } from "interfaces/User";

const ListContainer = styled.div`
  flex: 7;
`;

interface Props {
  messages: Message[];
  username: string;
}

const MessageList = ({ messages, username }: Props) => {
  return (
    <ListContainer>
      {messages.map((message: Message) => (
        <div key={nanoid()}>
          <p>{message.fromSelf ? "(yourself)" : username}</p>
          <li>{message.content}</li>
        </div>
      ))}
    </ListContainer>
  );
};

export default MessageList;
