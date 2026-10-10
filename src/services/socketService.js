import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      console.log("Websocket connection initiated...");
    } else if (!this.socket.connected) {
      this.socket.connect();
      console.log("Websocket connection resumed...");
    }
    return this.socket;
  }

  createRoom(roomId, username) {
    this.connect();
    this.socket.emit("create_room", { roomId, username });
  }

  joinRoom(roomId, username) {
    this.connect();
    this.socket.emit("join_room", { roomId, username });
  }

  emitAction(roomId, action, time) {
    if (this.socket) {
      this.socket.emit("player_action", { roomId, action, time });
    }
  }

  changeVideo(roomId, videoId) {
    if (this.socket) {
      this.socket.emit("change_video", { roomId, videoId });
    }
  }

  sendMessage(roomId, message) {
    if (this.socket) {
      this.socket.emit("send_message", { roomId, message });
    }
  }

  reconnectRoom(roomId, username, role) {
    this.connect();
    this.socket.emit("reconnect_room", { roomId, username, role });
  }

  promoteUser(roomId, targetUserId, newRole) {
    if (this.socket) {
      this.socket.emit("promote_user", { roomId, targetUserId, newRole });
    }
  }

  removeParticipant(roomId, targetUserId) {
    if (this.socket) {
      this.socket.emit('remove_participant', { roomId, targetUserId });
    }
  }

  on(event, callback) {
    this.connect();
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("Websocket connection paused successfully!");
    }
  }
}

const socketService = new SocketService();
export default socketService;
