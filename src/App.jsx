import React, { useState, useEffect, useMemo } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';
import BootScreen from './components/UI/BootScreen';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState('RANDOM');
  const [attacks, setAttacks] = useState([]);
  const [booting, setBooting] = useState(true);

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

        // Determine Attack Type
        let attackConfig;
        if (selectedAttackType === 'RANDOM') {
          attackConfig = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
        } else {
          attackConfig = ATTACK_TYPES.find(a => a.type === selectedAttackType) || ATTACK_TYPES[0];
        }

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
  }, [isAttacking, selectedServer, selectedAttackType]);

  return (
    <div className="bg-grid-pattern" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#050510' }}>

      {booting && <BootScreen onComplete={() => setBooting(false)} />}

      <div className="scanlines" />

      {/* Layer 1: Map (Background) */}
      <div style={{ position: 'absolute', inset: '40px', zIndex: 0, padding: '20px', transition: 'all 1s ease', opacity: booting ? 0 : 1 }}> {/* Fade in map */}
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
      <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none', opacity: booting ? 0 : 1, transition: 'opacity 1s ease 0.5s' }}>

        {/* Top Left: Control Panel */}
        <div style={{ pointerEvents: 'auto' }}>
          <ControlPanel
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            onToggleAttack={() => setIsAttacking(!isAttacking)}
            isAttacking={isAttacking}
            selectedAttackType={selectedAttackType}
            onSelectAttackType={setSelectedAttackType}
            attackTypes={ATTACK_TYPES}
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
