import React, { KeyboardEvent, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 2rem;
  border-top: 1px solid grey;
`;
const TextArea = styled.textarea`
  width: 70%;
`;

interface Props {
  onMessageSend: (msg: string) => void;
}

const MessageInput = ({ onMessageSend }: Props) => {
  const [message, setMessage] = useState("");

  const onButtonClick = () => {
    onMessageSend(message);
    setMessage("");
  };

  const onInputKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      onButtonClick();
      event.preventDefault();
    }
  };

  return (
    <Container>
      <TextArea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={onInputKeyPress}
      />
      <button onClick={onButtonClick}>Send</button>
    </Container>
  );
};

export default MessageInput;
