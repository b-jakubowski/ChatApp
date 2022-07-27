import socket from "config/socket";
import { User } from "interfaces/User";

export const usersReducer = (state: User[] | [], action: any) => {
  switch (action.type) {
    case "ADD_USERS":
      return action.payload;
    case "ADD_USER":
      return [...state, action.payload];
    case "DISCONNECT_USER":
      return [
        ...state.map((user) =>
          user.userID === action.payload.userID
            ? { ...user, connected: false }
            : user
        ),
      ];
    case "ADD_PRIVATE_MESSAGE":
      return [
        ...state.map((user) => {
          if (action.payload.from === user.userID) {
            const newMessage = {
              from: action.payload.from,
              fromSelf: false,
              content: action.payload.content,
            };
            const messages = !!user.messages
              ? [...user.messages, newMessage]
              : [newMessage];
            return {
              ...user,
              messages,
            };
          }
          return user;
        }),
      ];
    case "ADD_SELF_MESSAGE":
      return [
        ...state.map((user) => {
          if (user.userID === action.payload.activeUserId) {
            const newMessage = {
              from: socket.id,
              fromSelf: true,
              content: action.payload.message,
            };
            const messages = !!user.messages
              ? [...user.messages, newMessage]
              : [newMessage];
            return {
              ...user,
              messages,
            };
          }
          return user;
        }),
      ];
    default:
      return state;
  }
};
