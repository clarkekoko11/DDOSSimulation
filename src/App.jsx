import React, { useState, useEffect, useRef } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';
import InfoPanel from './components/UI/InfoPanel';
import BootScreen from './components/UI/BootScreen';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState('RANDOM');
  const [attacks, setAttacks] = useState([]); // Visual state (throttled)
  const [booting, setBooting] = useState(true);

  // Buffer for high-frequency simulation
  const attacksBuffer = useRef([]);

  // Attack Configuration
  const ATTACK_TYPES = [
    { type: 'UDP_FLOOD', color: '#ff003c' },
    { type: 'SQL_INJECTION', color: '#ffee00' },
    { type: 'HTTP_POST', color: '#00f0ff' },
    { type: 'DATA_EXFIL', color: '#ae00ff' }
  ];

  // 1. Simulation Loop (High Frequency, Updates Ref only)
  useEffect(() => {
    let simInterval;
    if (isAttacking && selectedServer) {
      simInterval = setInterval(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const randomSource = [
          (Math.random() * 360) - 180,
          (Math.random() * 140) - 70
        ];

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

        // Directly mutate buffer (very fast)
        attacksBuffer.current.push(newAttack);

        // Cleanup old attacks in buffer
        const now = Date.now();
        // Simple filter (optimization: could use index to slice, but filter is okay for <1000 items)
        if (attacksBuffer.current.length > 200) { // Safety cap
          attacksBuffer.current = attacksBuffer.current.filter(a => now - a.createdAt < 2000);
        }

      }, 50); // Run at 20Hz
    } else {
      attacksBuffer.current = [];
    }
    return () => clearInterval(simInterval);
  }, [isAttacking, selectedServer, selectedAttackType]);

  // 2. Render Loop (Lower Frequency, Syncs Ref to State)
  useEffect(() => {
    let renderInterval;
    if (isAttacking) {
      renderInterval = setInterval(() => {
        // Only update state if buffer has content
        // Using slice to create a new array ref for React
        const now = Date.now();
        // Final cleanup before render
        attacksBuffer.current = attacksBuffer.current.filter(a => now - a.createdAt < 2000);
        setAttacks([...attacksBuffer.current]);
      }, 100); // 10Hz Render (Smooth enough for dots, easy on CPU)
    } else {
      setAttacks([]);
    }
    return () => clearInterval(renderInterval);
  }, [isAttacking]);


  return (
    <div className="bg-grid-pattern h-screen w-screen overflow-hidden bg-[#050510] flex relative">

      {booting && <BootScreen onComplete={() => setBooting(false)} />}
      <div className="scanlines" />

      {/* --- LEFT SIDEBAR (Controls) --- */}
      <div
        className="h-full z-20 w-[360px] border-r border-cyber-dim/30 bg-black/20 backdrop-blur-sm flex flex-col p-4 pt-8 gap-4"
      >
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

      {/* --- CENTER (Map) --- */}
      <div className="flex-1 relative z-10">
        {/* Map Container */}
        <div
          style={{
            position: 'absolute',
            inset: booting ? '40px' : '20px',
            transition: 'all 1s ease',
            opacity: booting ? 0 : 1,
            border: '1px solid rgba(0, 240, 255, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 50px rgba(0,0,0,0.8) inset'
          }}
        >
          {/* Memoizing props or component here relies on 'attacks' updating less frequently */}
          <MapVisualizer selectedServer={selectedServer} attacks={attacks} />
        </div>
      </div>

      {/* --- RIGHT SIDEBAR (Info & Stats) --- */}
      <div
        className="h-full z-20 w-[400px] border-l border-cyber-dim/30 bg-black/20 backdrop-blur-sm flex flex-col p-4 pt-8 gap-4"
      >
        <StatsPanel isAttacking={isAttacking} attacks={attacks} />
        <InfoPanel selectedAttackType={selectedAttackType} />
      </div>

    </div>
  );
}

export default App;
