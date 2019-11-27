import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:3001");

export default function subscribeToTimer(cb) {
  socket.on("connection", timestamp => cb(null, timestamp));
  socket.emit('example_message', 'demo');
}
