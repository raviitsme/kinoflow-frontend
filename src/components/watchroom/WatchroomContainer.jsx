import React, { useState, useEffect } from "react";
import socketService from "../../services/socketService";
import HostPlayer from "./HostPlayer";
import ParticipantPlayer from "./PartipantPlayer";
import ChatSidebar from "./ChatSidebar";

export default function WatchroomContainer({ roomData, onLeaveRoom }) {
  const [participants, setParticipants] = useState(roomData.participants || []);
  const [myRole, setMyRole] = useState(roomData.role || "Participant");
  const [notification, setNotification] = useState("");

  const roomId = roomData.roomId;
  const isHost = myRole === "Host";
  const canControl = isHost || myRole === "Moderator";

  // Flash a notification banner (e.g., "Alex joined", "You are now Moderator")
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  useEffect(() => {
    // 1. Listen for user list updates
    const handleRoomUpdate = (data) => {
      if (data.participants) {
        setParticipants(data.participants);
      }
    };

    // 2. Listen for host reassignment if previous host left
    const handleHostChanged = ({ hostId, hostName }) => {
      if (hostId === socketService.socket?.id) {
        setMyRole("Host");
        showNotification(
          "The previous Host left. You have been promoted to Host!",
        );
      } else {
        showNotification(`Host controls transferred to ${hostName}`);
      }
    };

    // 3. Listen for direct personal promotion/demotion
    const handleRoleAssigned = ({ role }) => {
      setMyRole(role);
      showNotification(`Your role was updated to: ${role}`);
    };

    socketService.on("room_update", handleRoomUpdate);
    socketService.on("host_changed", handleHostChanged);
    socketService.on("role_assigned", handleRoleAssigned);

    return () => {
      socketService.off("room_update", handleRoomUpdate);
      socketService.off("host_changed", handleHostChanged);
      socketService.off("role_assigned", handleRoleAssigned);
    };
  }, []);

  const handleExit = () => {
    sessionStorage.removeItem("kinoflow_session");
    socketService.disconnect();
    onLeaveRoom();
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col">
      {/* Cinema Top Bar */}
      <header className="h-16 px-6 border-b border-brand-border/60 bg-brand-black/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center font-black text-brand-white shadow-[0_0_12px_rgba(229,9,20,0.5)]">
            K
          </div>
          <span className="text-lg font-black tracking-tight text-brand-white">
            KINO<span className="text-brand-red">FLOW</span>
          </span>
          <span className="hidden sm:inline-block w-px h-4 bg-brand-border mx-1" />
          <span className="hidden sm:inline-block text-xs font-mono text-brand-muted">
            Room: <strong className="text-brand-white">{roomId}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded bg-brand-charcoal border border-brand-border text-brand-muted">
            Role:{" "}
            <strong
              className={
                isHost
                  ? "text-brand-red"
                  : myRole === "Moderator"
                    ? "text-amber-400"
                    : "text-brand-white"
              }
            >
              {myRole}
            </strong>
          </span>
          <button
            onClick={handleExit}
            className="text-xs px-3.5 py-1.5 rounded-lg border border-brand-border hover:border-brand-red/60 hover:text-brand-red transition-all cursor-pointer font-medium"
          >
            Leave Party
          </button>
        </div>
      </header>

      {/* Dynamic Notification Banner */}
      {notification && (
        <div className="bg-brand-red/10 border-b border-brand-red/30 text-brand-white text-xs px-4 py-2 text-center font-medium animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Split-Screen Watchroom Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dedicated Player Component based on Role */}
        <section className="lg:col-span-8 flex flex-col gap-4 w-full">
          {canControl ? (
            <HostPlayer
              roomId={roomId}
              isHost={isHost} // 👈 Passes boolean down so only Host runs the alignment heartbeat
              currentVideoId={roomData.initialState?.videoId || "LXb3EKWsInQ"}
            />
          ) : (
            <ParticipantPlayer
              roomId={roomId}
              currentVideoId={roomData.initialState?.videoId || "LXb3EKWsInQ"}
            />
          )}
        </section>

        {/* Right Column: Chat & Participant Roster */}
        <section className="lg:col-span-4 w-full h-162.5 lg:h-[calc(100vh-6rem)] sticky top-20">
          <ChatSidebar
            roomId={roomId}
            currentUser={{
              username: roomData.username, 
              role: myRole,
              id: socketService.socket?.id,
            }}
            participants={participants}
          />
        </section>
      </main>
    </div>
  );
}
