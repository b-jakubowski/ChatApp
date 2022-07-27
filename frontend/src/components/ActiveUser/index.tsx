import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  padding: 10;
  border-bottom: 1px solid grey;
`;

interface Props {
  username?: string;
}

const ActiveUser = ({ username }: Props) => {
  return (
    <Container>
      <p>{username ?? "Loading"}</p>
    </Container>
  );
};

export default ActiveUser;
