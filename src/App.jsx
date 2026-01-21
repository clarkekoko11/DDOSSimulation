import React, { useState, useEffect } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attacks, setAttacks] = useState([]);

  // Attack Generation Logic
  useEffect(() => {
    let interval;
    if (isAttacking && selectedServer) {
      interval = setInterval(() => {
        // Generate a new "packet" from random source
        const id = Math.random().toString(36).substr(2, 9);
        const randomSource = [
          (Math.random() * 360) - 180, // Longitude
          (Math.random() * 140) - 70   // Latitude (avoid extremes)
        ];

        const newAttack = { id, source: randomSource, createdAt: Date.now() };

        setAttacks(prev => [...prev, newAttack]);

        // Cleanup old attacks (fake animation duration)
        setTimeout(() => {
          setAttacks(prev => prev.filter(a => a.id !== id));
        }, 2000); // 2 seconds travel time approx

      }, 100); // New packet every 100ms
    } else {
      // Clear attacks if stopped
      setAttacks([]);
    }
    return () => clearInterval(interval);
  }, [isAttacking, selectedServer]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#050510' }}>

      {/* Layer 1: Map (Background) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MapVisualizer selectedServer={selectedServer} attacks={attacks} />
      </div>

      {/* Layer 2: UI (Foreground) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none' }}>

        {/* Top Left: Control Panel */}
        <div style={{ pointerEvents: 'auto' }}>
          <ControlPanel
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            onToggleAttack={() => setIsAttacking(!isAttacking)}
            isAttacking={isAttacking}
          />
        </div>

        {/* Bottom Right: Stats Panel */}
        <div style={{ pointerEvents: 'auto' }}>
          <StatsPanel isAttacking={isAttacking} />
        </div>

      </div>
    </div>
  );
}

export default App;
