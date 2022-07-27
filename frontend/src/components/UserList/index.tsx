import { User } from "interfaces/User";
import React from "react";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;
const ListItem = styled.li`
  color: white;
  background-color: ${(props) => props.color};
  padding: 0.8rem;
  border: 1px solid grey;
`;
const UserListContainer = styled.div`
  flex: 1;
  background-color: rgb(47, 26, 48);
`;
const Dot = styled.span`
  height: 0.8rem;
  width: 0.8rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: inline-block;
`;

interface Props {
  users: User[];
  activeUser: User;
  onUserClick: (index: number) => void;
}

const UserList = ({ users, activeUser, onUserClick }: Props) => {
  return (
    <UserListContainer>
      <List>
        {users.length > 0 &&
          users.map((user: User, i: number) => (
            <ListItem
              key={`${user.userID}`}
              onClick={() => onUserClick(i)}
              color={activeUser?.userID === user.userID ? "blue" : "inherit"}
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
            </ListItem>
          ))}
      </List>
    </UserListContainer>
  );
};

export default UserList;
