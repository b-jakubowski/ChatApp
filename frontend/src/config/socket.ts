import io from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_SERVER_URL as string;
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default socket;
