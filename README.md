# KinoFlow: Synchronized YouTube Watch Party Platform

A low-latency, real-time shared cinema application powered by **WebSockets (Socket.IO)**, **React 19**, **Node.js / Express**, and the **Native YouTube IFrame Player API**.

---

## 1. Live Production Deployment

- **Frontend (Vercel):** [https://kinoflow-three.vercel.app/](https://kinoflow-three.vercel.app/)
- **Backend WebSocket Service (Render):** [https://kinoflow-backend.onrender.com/](https://kinoflow-backend.onrender.com/)

---

## 2. Setup and Run Instructions

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Git**

### Local Development Setup

#### 1. Clone the repository
```bash
git clone https://github.com/raviitsme/KinoFlow.git
cd KinoFlow
```

#### 2. Run the Backend Service
```bash
cd backend
npm install
node server.js
# The WebSocket & Express server will listen on http://localhost:5000
```

#### 3. Run the Frontend Client
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# The Vite development server will start at http://localhost:5173
```

#### Environment Variables (`frontend/.env`)
| Variable | Description | Default Local | Production Example |
| :--- | :--- | :--- | :--- |
| `VITE_WS_URL` | WebSocket Server endpoint | `http://localhost:5000` | `https://kinoflow-backend.onrender.com` |

---

## 3. Architecture Overview: How WebSockets Integrate with the Flow

KinoFlow is built around an **in-memory, ephemeral room-based architecture** coordinated in real-time through **Socket.IO**:

```text
 ┌────────────────┐          WebSocket Event          ┌────────────────────┐
 │  Host Client   │ ─────────────────────────────────> │  Socket.IO Server  │
 └────────────────┘   player_action / change_video    └────────────────────┘
                                                                 │
                                                    playback_broadcast
                                                                 │
                                                                 ▼
                                                      ┌────────────────────┐
                                                      │ Participant Client │
                                                      └────────────────────┘
```

### End-to-End WebSocket Flow:
1. **Room Creation & Handshake:**
   - Host emits `create_room`. Server creates in-memory room state (`videoId`, `playState`, `currentTime`, `participants`) and assigns `Host` role.
   - Joiners emit `join_room` and receive initial room state via `sync_state`.
2. **Synchronized Playback (Sub-Second Frame Lock):**
   - When the Host or Moderator triggers `play`, `pause`, or `seek`, the client emits `player_action`.
   - The server validates the sender's role and immediately broadcasts `playback_broadcast` to all room peers.
   - Peer players apply the state with **latency compensation** and a programmatic **time-lock** to prevent feedback echo loops.
   - The Host sends periodic `sync` heartbeats every 4 seconds to maintain long-running drift alignment (<500ms).
3. **Participant Change Request & Approval System:**
   - Participants cannot modify the timeline directly. If a participant wants to change the video, they emit `request_change`.
   - The server routes this request directly to active Hosts and Moderators (`incoming_change_request`).
   - Host/Moderator clicks **Approve** or **Decline** (`resolve_change_request`).
   - Upon approval, the server triggers `video_changed` across the room and informs the requesting participant.
4. **Session Rehydration & Self-Healing:**
   - Browser tabs store room session in `sessionStorage`. On page refresh, clients emit `reconnect_room` to recover role and video timestamp without room teardown.
   - If the Host disconnects, the server auto-promotes the next senior participant to Host via `host_changed`.

---

## 4. Code Walkthrough Readiness: Technologies & Logic Breakdown

### A. Technologies Used
- **React 19 & Vite:** Ultra-fast compilation, reactive component lifecycle hooks (`useRef` for YouTube player instances to avoid re-renders, `useState` for roster/chat).
- **Socket.IO & Node.js:** Full-duplex WebSocket connections with fallback to long-polling, room-level socket grouping (`socket.join(roomId)`), and targeted peer messaging (`io.to(id)`).
- **Tailwind CSS v4:** Cinema dark-theme layout, glassmorphic floating overlays, and custom animations (`fadeIn`, `pulse`).
- **YouTube IFrame Player API:** Low-level programmatic player control (`seekTo`, `playVideo`, `pauseVideo`, `loadVideoById`).

### B. Core Logic & Problem-Solving Mechanisms

| Challenge | Solution in KinoFlow |
| :--- | :--- |
| **Playback Drift & Transit Delay** | Emits lightweight timeline events with assumed network transit compensation ($\Delta t = 200\text{ms}$). Participants adjust without waiting for full buffer reload. |
| **Infinite Event Feedback Loops** | Managed via `lastProgrammaticTime` (time-lock window). Prevents YouTube API state changes triggered programmatically from firing reciprocal socket broadcasts. |
| **Clock Desynchronization** | Avoids relying on client-vs-server timestamps (`Date.now() - sentAt`), using drift differentials (`drift = |localTime - targetTime|`). Hard seeking only triggers when drift $>0.5\text{s}$. |
| **Role-Based Access Control (RBAC)** | Strict server-side verification: unauthorized participants cannot emit `player_action`, `change_video`, or role promotions. |
| **Participant Request Approvals** | Non-blocking modal queue for Hosts/Moderators to approve or reject suggestions in real time. |
| **Zero Database Overhead** | Fully ephemeral in-memory state model; rooms automatically clean up from server RAM when all members leave. |

---

## 5. WebSocket Event Reference

| Event Name | Direction | Access Role | Purpose |
| :--- | :--- | :--- | :--- |
| `create_room` | Client $\rightarrow$ Server | Anyone | Initialize a new room; assign Host |
| `join_room` | Client $\rightarrow$ Server | Anyone | Join existing room as Participant |
| `player_action` | Client $\rightarrow$ Server | Host, Moderator | Broadcast play, pause, or seek |
| `request_change` | Client $\rightarrow$ Server | Participant | Propose video change to Host |
| `resolve_change_request` | Client $\rightarrow$ Server | Host, Moderator | Approve or decline change proposal |
| `incoming_change_request`| Server $\rightarrow$ Client | Host, Moderator | Notify controllers of pending request |
| `request_response` | Server $\rightarrow$ Client | Participant | Notify requester of approval/rejection |
| `playback_broadcast` | Server $\rightarrow$ Client | All Room Members | Broadcast timeline position & action |
| `video_changed` | Server $\rightarrow$ Client | All Room Members | Switch YouTube video ID across room |
| `host_changed` | Server $\rightarrow$ Client | All Room Members | Announce auto-promoted Host upon disconnect |
