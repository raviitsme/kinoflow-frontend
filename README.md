## KinoFlow: Synchronized YouTube Watch Party Platform

A low-latency, real-time shared cinema application powered by WebSockets, React, Node.js, and the native YouTube IFrame Player API.

## Live Production Deployment

- Frontend (Vercel): https://kinoflow-three.vercel.app/ [URL 🔗](https://kinoflow-three.vercel.app/)

- Backend WebSocket Service (Render): https://kinoflow-backend.onrender.com/ [URL 🔗](https://kinoflow-backend.onrender.com/)

## Repository Short Description (About Section)

Real-time synchronized YouTube watch party system featuring room-based WebSockets, strict role-based access co

Topics / Tags: react nodejs socket-io websockets youtube-iframe-api watch-party realtime tailwind-css javascript

## Overview

KinoFlow is a full-stack, real-time shared video theater platform engineered to eliminate playback drift, buffer loopbacks, and state desynchronization across distributed networks.

The application allows users to create ephemeral watch party rooms, invite peers through 6-character room codes or direct links, communicate via real-time chat, and watch YouTube streams in unified frame lock. All timeline actions (play, pause, seek, and video changes) propagate across connected clients with sub-second accuracy.

## Key Features

- Sub-Second Playback Synchronization:

- Network transit latency compensation calculates transit lag ( TargetTime = ServerTime +Δt).

- Periodic 4-second heartbeat updates keep long-running videos aligned.

- Programmatic 1.5-second time-lock (lastProgrammaticTime) suppresses intermediate YouTube player state-change loops (such as buffering and resolution switching).

## Ephemeral Room-Based Architecture:

- Dynamic alphanumeric 6-character room code generation.

- Zero persistent storage overhead: in-memory state models ensure high-throughput, low-latency execution with automated server garbage collection when rooms empty.

- Strict Role-Based Access Control (RBAC):

- Host (Room Creator): Full control over playback, video loading, member role promotions, and participant removal.

- Moderator (Host-Promoted): Authorized shared remote controls (play, pause, seek, and video loading).

- Participant (Default Joiner): Spectator mode with personal audio volume, closed captions (CC), speed, and stream quality options. Direct attempts to alter the playback timeline trigger automated snap-back to the Host's position.

- Roster Management and Actions Menu:

- Dynamic participant sidebar displaying user roles, connection indicators, and avatars.

- Contextual 3-dots actions menu (...) accessible by the Host to assign Moderator privileges or remove participants.

- Immediate kick event handler terminates target user sessions cleanly and returns them to the landing view.

## Session Rehydration:

- Persistent tab reconnection using sessionStorage and socket reconnect handshakes (reconnect_room).

- Reusable socket service pattern preserves bound event listeners across rejoining and page reloads without requiring manual browser refreshes.

- Integrated Cinema Chat:


## Architecture and WebSocket Data Flow

```
[Host Client] [WebSocket Server] [Participant Client]
| | |
|--- player_action (play/seek) ->| |
| { time, action } |--- playback_broadcast ------>|
| | { time, action, sentAt } |--- Set Time-Lock (1.5s)
| | |--- seekTo() & playVideo()
| | |
| |<- request_sync (onReady) -----|
| |--- sync_state --------------->| (Applies Host State)
| | |
|--- promote_user ------------->| |
| { targetUserId, role } |--- role_assigned ------------>| (Unlocks Control Panel)
| |--- room_update (broadcast) -->|
```

## Technical Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 18, Vite | Component architecture, virtual DOM updates, fast HMR |
| Styling | Tailwind CSS | Dark cinema theme, glassmorphic layout overlays |
|   | Real-time Client Socket.IO Client | Bidirectional event emissions and state reconnect loops |
| Media Engine YouTube IFrame Player API Video embedding and programmatic playback controls |   |   |
| Backend | Node.js, Express | Modular HTTP server, lifecycle routing |
| Real-time Engine Socket.IO |   | Room management, role authorization, event broadcasting |
| State Storage In-Memory (JavaScript OOP) Zero-latency ephemeral room state management |   |   |

## WebSocket Events Reference

## Client to Server

| Event | Payload | Description | Access Level |
| --- | --- | --- | --- |
| create_room | { roomId, username } | Initializes a room; assigns caller as Host | Any user |
| join_room | { roomId, username } | Joins an existing room as a Participant | Any user |
|   | reconnect_room { roomId, username, role } | Re-attaches session upon tab reload | Any user |
| request_sync | { roomId } | Requests current playback state on player | Any user |
|   |   | ready |   |
| player_action | { roomId, action, time } | Broadcasts play, pause, or seek command | Host, |
|   |   |   | Moderator |
| change_video | { roomId, videoId } | Updates active YouTube video ID | Host, |
|   |   |   | Moderator |
| promote_user | { roomId, targetUserId, newRole | Updates user role (e.g. Moderator) | Host only |
| } |   |   |   |
|   | remove_participant { roomId, targetUserId } | Removes target user from watchroom | Host only |
| send_message | { roomId, message } | Dispatches chat text to the room channel | Any user |


## Server to Client

| Event | Payload | Description |
| --- | --- | --- |
| room_created | { roomId, role, participants } | Confirms room creation to creator |
| room_joined | { roomId, role, username, participants } | Confirms room entry to joiner |
| room_reconnected | { roomId, role, username, participants, | Re-establishes state after refresh |
|   | initialState } |   |
| sync_state | { videoId, playState, currentTime } | Sends current timeline state |
|   | playback_broadcast { action, time, sentAt } | Forwards validated playback events with |
|   |   | timestamp |
| video_changed { videoId } |   | Notifies clients to switch active video stream |
| room_update | { participants } | Broadcasts updated participant roster |
| role_assigned { role } |   | Notifies individual user of an assigned role |
|   |   | update |
| participant_removed { roomId } |   | Informs target user that they were removed |
| host_changed | { hostId, hostName } | Notifies room of automated Host promotion |
| new_message | { username, role, message, timestamp } | Forwards chat message to room participants |

## Getting Started

## Prerequisites

- Node.js (version 18.x or higher)

- npm (version 9.x or higher)

## Installation

```
1. Clone the repository:
git clone https://github.com/your-username/KinoFlow.git
cd KinoFlow
2. Setup and run Backend:
cd backend
npm install
node server.js
The backend server will listen on http://localhost:5000.
3. Setup and run Frontend:
cd ../frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.
```

## Production Deployment

## Backend (Render)

- Deployment URL: https://kinoflow-backend.onrender.com/ [URL 🔗](https://kinoflow-backend.onrender.com/)

- Root Directory: backend

- Build Command: npm install


- Start Command: node server.js

## Frontend (Vercel)

- Deployment URL: https://kinoflow-three.vercel.app/ [URL 🔗](https://kinoflow-three.vercel.app/)

- Root Directory: frontend

- Build Command: npm run build

- Output Directory: dist

- Environment Variables:

- VITE_WS_URL: https://kinoflow-backend.onrender.com
