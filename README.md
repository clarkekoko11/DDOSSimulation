# L.O.G.I.C (Layered Overload Generation & Impact Control)

**L.O.G.I.C** is an advanced, interactive DDoS simulation and visualization tool designed for educational purposes. It demonstrates the dynamics of network attacks, defense mechanisms, and traffic patterns in a visually immersive cyberpunk environment.


## 🚀 Features

- **Real-Time Attack Simulation**: Visualize various attack vectors including UDP Floods, SQL Injection, HTTP POST, and Data Exfiltration.
- **Interactive Global Map**: 3D Globe visualization showing attack sources and targets with region-specific flags.
- **Defense Mechanisms**:
  - **Rate Limiting**: Mitigate volumetric floods.
  - **WAF (Web Application Firewall)**: Filter malicious payloads.
  - **Anycast Network**: Distribute load across global nodes.
  - **Blackhole Routing**: Emergency traffic null-routing.
- **Packet Inspector**: Live "sniffer" terminal showing simulated packet headers and traffic content.
- **Live Statistics**: Real-time monitoring of bandwidth, requests per second, and packet flow.
- **Educational Mode**: Learn about different attack types and how to defend against them.

## 🛠️ Technology Stack

- **Core**: React 18, Vite
- **Styling**: TailwindCSS, Vanilla CSS (Cyberpunk Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Geo-Visualization**: D3-geo (simulated) / Custom SVG mapping

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/logic-ddos-sim.git
    cd logic-ddos-sim
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## 👨‍💻 Credits

**Developed by Clarke Serrano**

Created as a visual demonstration of network security concepts and frontend engineering capabilities.

---
*Disclaimer: This tool is a **simulation only**. No actual network packets are sent to external targets. It is a frontend visualization and is completely safe to run.*
