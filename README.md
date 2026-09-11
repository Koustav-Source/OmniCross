# 🚦 OmniCross — Traffic Road Intelligence Command Centre

OmniCross is an enterprise-grade, technically credible **Smart Traffic Operations and Decision-Support Platform**. It combines real-time synthetic traffic telemetry, database persistence, explainable traffic intelligence scoring, rule-based incident detection, explainable adaptive signal recommendations, and role-based access control (RBAC).

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │ Synthetic Traffic Telemetry Simulator  │
                               │ (Dynamic Vehicle Count, Speed, Queue)  │
                               └──────────────────┬─────────────────────┘
                                                  │
                                                  ▼
┌───────────────────────┐             ┌─────────────────────────────────┐             ┌─────────────────────────┐
│     MongoDB / Mem     │ ◄────────── │ Node.js + Express TypeScript    │ ──────────► │ Socket.IO Stream Server │
│ Database Persistence  │             │   Traffic Intelligence Engine   │             │  (Real-time Updates)    │
└───────────────────────┘             └──────────────────┬──────────────┘             └────────────┬────────────┘
                                                         │                                         │
                                                         ▼                                         ▼
                                      ┌──────────────────────────────────────────────────────────────────┐
                                      │              React Command Centre Dashboard (TSX)               │
                                      │  (Overview, Digital Twin Visualizer, Incidents, Analytics, Studio)│
                                      └──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express, TypeScript, Socket.IO, JWT, bcryptjs |
| **Database** | MongoDB, Mongoose, MongoDB Memory Server (Zero-config embedded fallback) |
| **Intelligence** | Deterministic Explainable Congestion Engine & Adaptive Retiming Calculator |

---

## 🧠 Traffic Intelligence Engine & Technical Specs

### 1. Explainable Congestion Calculation
Rather than treating intelligence as a black box, OmniCross evaluates four key telemetry variables:
* **Occupancy Score (40%):** Road space utilization percentage.
* **Speed Deficit (30%):** Ratio of current speed against free-flow baseline (60 km/h).
* **Queue Length Score (20%):** Queue accumulation normalized against maximum threshold (300m).
* **Vehicle Density (10%):** Active vehicles per available lane.

**Congestion Levels:** `NORMAL` (0-34), `MODERATE` (35-59), `HEAVY` (60-79), `CRITICAL` (80-100).

*Example Output:*
```json
{
  "congestionScore": 82,
  "congestionLevel": "CRITICAL",
  "explanation": "CRITICAL GRIDLOCK: Road occupancy is at 92% with severe speed degradation (12 km/h) and a 240m queue. Urgent traffic management required."
}
```

### 2. Explainable Adaptive Signal Recommendation
Evaluates approach volume imbalances (e.g. North-South vs. East-West flow) to recommend signal timing splits:
* **Recommendation:** "Increase North-South green duration from 40s to 58s"
* **Reason:** "North-South vehicle density is 2.3x higher than East-West traffic flow (58 vs 25 vehicles)."
* **Expected Benefit:** "Reduce queue accumulation at North-South approach by ~32% and optimize throughput."

---

## 🚔 Role-Based Access Control (RBAC)

OmniCross implements JWT-authenticated Role-Based Access Control supporting six explicit operational roles:
1. **SUPER_ADMIN**: Full system control, data modification, and user management.
2. **CITY_ADMIN**: Manage crossings, node parameters, and city-wide configurations.
3. **TRAFFIC_OPERATOR**: Manage signal phases, apply retiming recommendations, and handle overrides.
4. **EMERGENCY_OPERATOR**: Manage emergency incidents, dispatches, and Corridor Green Wave takeovers.
5. **ANALYST**: View operational analytics, ALPR streams, and throughput performance metrics.
6. **VIEWER**: Read-only monitoring of live dashboards.

---

## 📡 REST API Specifications

### Authentication
* `POST /api/auth/register` — Register a new command centre user.
* `POST /api/auth/login` — Authenticate and receive JWT bearer token.
* `GET /api/auth/me` — Retrieve active user identity and role.

### Crossings
* `GET /api/crossings` — Fetch list of all monitored crossings.
* `GET /api/crossings/:id` — Fetch details for specific junction node.
* `POST /api/crossings` — Register/deploy a custom junction node.
* `PUT /api/crossings/:id` — Update junction parameters or state.
* `DELETE /api/crossings/:id` — Remove crossing from command network.

### Traffic Telemetry
* `GET /api/traffic/live` — Fetch live telemetry snapshot across all crossings.
* `GET /api/traffic/history` — Fetch historical telemetry logs.
* `GET /api/traffic/crossing/:id` — Fetch historical telemetry for specific crossing.

### Incidents
* `GET /api/incidents` — Fetch all incidents.
* `POST /api/incidents` — Report/inject an operational incident.
* `PUT /api/incidents/:id` — Update incident status (DETECTED → VERIFIED → DISPATCHED → RESPONDING → RESOLVED → CLOSED).
* `DELETE /api/incidents/:id` — Delete incident.

### Analytics & System Health
* `GET /api/analytics/overview` — Network health score, active incidents, and aggregate throughput.
* `GET /api/analytics/performance` — Before vs. After optimization delay comparison and worst performing nodes ranking.
* `GET /api/health` — Returns DB connection state, Socket.IO status, and Telemetry Simulator health.

---

## 📡 Synthetic Traffic Telemetry Simulator vs. Future IoT Roadmap

### Current Implementation
The included **Synthetic Traffic Telemetry Simulator** runs on the backend server every 3 seconds, continuously adjusting vehicle density, speed, queue lengths, and signal phase timers, and emitting live Socket.IO events (`telemetry:update`, `incident:new`).

### Future Real IoT Integration Roadmap
The telemetry layer is decoupled behind a `TelemetryProvider` interface. In production deployments with physical smart city infrastructure:
1. Physical radar detectors, inductive loop sensors, and camera vision edge nodes stream telemetry via MQTT / HTTP POST to `/api/traffic/telemetry`.
2. The `TrafficIntelligenceEngine` processes real sensor data using the exact same calculation methods.
3. No business logic or frontend changes are required to transition from simulated telemetry to physical hardware feeds.

---

## 🚀 Running the Project Locally

### Prerequisites
* **Node.js**: v18+ installed

### 1. Installation
```bash
npm install
```

### 2. Start Backend Server (with auto-configured embedded Database & Socket.IO Telemetry Engine)
```bash
npx tsx backend/src/server.ts
```
*The backend server starts on port `5000` with MongoDB memory server auto-fallback and pre-seeded default crossings, RBAC users, and incidents.*

### 3. Start Frontend Dashboard
In a new terminal window:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👨‍💻 Author & Engineering Credibility
Developed as a production-style Smart Traffic Command Centre demonstrating clean full-stack architecture, explainable operational algorithms, real-time WebSocket state management, and modern UI/UX design.
