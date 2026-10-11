import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import WatchroomContainer from "./components/watchroom/WatchroomContainer";
import socketService from "./services/socketService";

const SESSION_KEY = "kinoflow_session";

export default function App() {
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isReconnecting, setIsReconnecting] = useState(() => {
    return !!sessionStorage.getItem(SESSION_KEY);
  });

  // 1. Check for an active session on mount / page reload
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { roomId, username, role } = JSON.parse(saved);
        socketService.reconnectRoom(roomId, username, role);
      } catch (err) {
        sessionStorage.removeItem(SESSION_KEY);
        setIsReconnecting(false);
      }
    } else {
      setIsReconnecting(false);
    }

    const handleRoomCreated = (data) => {
      setIsReconnecting(false);
      const session = {
        roomId: data.roomId,
        role: "Host",
        username: data.participants[0]?.username || "Host",
        participants: data.participants,
      };
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          roomId: session.roomId,
          username: session.username,
          role: session.role,
        }),
      );
      setRoomData(session);
    };

    const handleRoomJoined = (data) => {
      setIsReconnecting(false);
      const session = {
        roomId: data.roomId,
        role: "Participant",
        username: data.username,
        participants: data.participants,
      };
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          roomId: session.roomId,
          username: session.username,
          role: session.role,
        }),
      );
      setRoomData(session);
    };

    const handleRoomReconnected = (data) => {
      setIsReconnecting(false);
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          roomId: data.roomId,
          username: data.username,
          role: data.role,
        }),
      );
      setRoomData({
        roomId: data.roomId,
        role: data.role,
        username: data.username,
        participants: data.participants,
        initialState: data.initialState,
      });
    };

    const handleSessionExpired = ({ message }) => {
      setIsReconnecting(false);
      sessionStorage.removeItem(SESSION_KEY);
      setRoomData(null);
      setErrorMessage(message);
    };

    const handleParticipantRemoved = () => {
      setIsReconnecting(false);
      sessionStorage.removeItem(SESSION_KEY);
      socketService.disconnect();
      setRoomData(null);
      alert("You have been removed by the host!");
    };

    const handleErrorMsg = ({ message }) => {
      setIsReconnecting(false);
      setErrorMessage(message);
    };

    socketService.on("room_created", handleRoomCreated);
    socketService.on("room_joined", handleRoomJoined);
    socketService.on("room_reconnected", handleRoomReconnected);
    socketService.on("session_expired", handleSessionExpired);
    socketService.on("error_message", handleErrorMsg);
    socketService.on("participant_removed", handleParticipantRemoved);

    return () => {
      socketService.off("room_created", handleRoomCreated);
      socketService.off("room_joined", handleRoomJoined);
      socketService.off("room_reconnected", handleRoomReconnected);
      socketService.off("session_expired", handleSessionExpired);
      socketService.off("error_message", handleErrorMsg);
      socketService.off("participant_removed", handleParticipantRemoved);
    };
  }, []);

  // Handle Host Room Creation
  const handleCreateRoom = (username) => {
    setErrorMessage("");
    const generatedCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    socketService.createRoom(generatedCode, username);
  };

  // Handle Participant Join
  const handleJoinRoom = (username, roomCode) => {
    setErrorMessage("");
    socketService.joinRoom(roomCode, username);
  };

  // Handle Exit
  const handleLeaveRoom = () => {
    sessionStorage.removeItem(SESSION_KEY);
    socketService.leaveRoom(roomData?.roomId);
    socketService.disconnect();
    setRoomData(null);
  };

  return (
    <>
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-brand-red text-brand-white text-xs px-4 py-2 rounded-lg shadow-xl font-bold animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {isReconnecting ? (
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center font-black text-brand-white text-2xl shadow-[0_0_20px_rgba(229,9,20,0.5)] animate-pulse">
              K
            </div>
            <p className="text-sm text-brand-muted font-medium">Reconnecting to your watch party...</p>
          </div>
        </div>
      ) : roomData ? (
        <WatchroomContainer roomData={roomData} onLeaveRoom={handleLeaveRoom} />
      ) : (
        <LandingPage
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </>
  );
}
