export interface User {
  userID: string;
  username: string;
  self: boolean;
  connected: boolean;
  messages: Message[];
}

export interface Message {
  from: string;
  content: string;
  fromSelf: boolean;
}
