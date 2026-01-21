import React, { useState, useEffect } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attacks, setAttacks] = useState([]);

  // Attack Configuration
  const ATTACK_TYPES = [
    { type: 'UDP_FLOOD', color: '#ff003c' }, // Red
    { type: 'SQL_INJECTION', color: '#ffee00' }, // Yellow
    { type: 'HTTP_POST', color: '#00f0ff' }, // Cyan
    { type: 'DATA_EXFIL', color: '#ae00ff' } // Purple
  ];

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

        // Random Attack Type
        const attackConfig = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

        const newAttack = {
          id,
          source: randomSource,
          createdAt: Date.now(),
          type: attackConfig.type,
          color: attackConfig.color
        };

        setAttacks(prev => [...prev, newAttack]);

        // Cleanup old attacks (fake animation duration)
        setTimeout(() => {
          setAttacks(prev => prev.filter(a => a.id !== id));
        }, 2000); // 2 seconds travel time approx

      }, 50); // Faster generation (50ms) for more density
    } else {
      // Clear attacks if stopped
      setAttacks([]);
    }
    return () => clearInterval(interval);
  }, [isAttacking, selectedServer]);

  return (
    <div className="bg-grid-pattern" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#050510' }}>

      <div className="scanlines" />

      {/* Layer 1: Map (Background) */}
      <div style={{ position: 'absolute', inset: '40px', zIndex: 0, padding: '20px' }}> {/* Inset 40px for "padding style" */}
        <div style={{
          width: '100%',
          height: '100%',
          border: '2px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5) inset'
        }}>
          <MapVisualizer selectedServer={selectedServer} attacks={attacks} />
        </div>
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
          <StatsPanel isAttacking={isAttacking} attacks={attacks} />
        </div>

      </div>
    </div>
  );
}

export default App;
