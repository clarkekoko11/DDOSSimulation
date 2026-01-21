import React, { useState, useEffect, useMemo } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';
import InfoPanel from './components/UI/InfoPanel'; // New Import
import BootScreen from './components/UI/BootScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState('RANDOM');
  const [attacks, setAttacks] = useState([]);
  const [booting, setBooting] = useState(true);

  // Panel State (Lifted)
  const [controlPanelPinned, setControlPanelPinned] = useState(true);
  const [statsPanelPinned, setStatsPanelPinned] = useState(true);

  // Attack Configuration
  const ATTACK_TYPES = [
    { type: 'UDP_FLOOD', color: '#ff003c' },
    { type: 'SQL_INJECTION', color: '#ffee00' },
    { type: 'HTTP_POST', color: '#00f0ff' },
    { type: 'DATA_EXFIL', color: '#ae00ff' }
  ];

  // Attack Generation Logic
  useEffect(() => {
    let interval;
    if (isAttacking && selectedServer) {
      interval = setInterval(() => {
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

        setAttacks(prev => [...prev, newAttack]);

        setTimeout(() => {
          setAttacks(prev => prev.filter(a => a.id !== id));
        }, 2000);

      }, 50);
    } else {
      setAttacks([]);
    }
    return () => clearInterval(interval);
  }, [isAttacking, selectedServer, selectedAttackType]);

  return (
    <div className="bg-grid-pattern h-screen w-screen overflow-hidden bg-[#050510] flex relative">

      {booting && <BootScreen onComplete={() => setBooting(false)} />}
      <div className="scanlines" />

      {/* --- LEFT SIDEBAR (Controls) --- */}
      <div
        className={`h-full z-20 transition-all duration-300 flex flex-col p-4 pt-8 gap-4 ${controlPanelPinned ? 'w-[360px] border-r border-cyber-dim/30 bg-black/20 backdrop-blur-sm' : 'w-0 p-0 overflow-hidden'}`}
      >
        {controlPanelPinned && (
          <ControlPanel
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            onToggleAttack={() => setIsAttacking(!isAttacking)}
            isAttacking={isAttacking}
            selectedAttackType={selectedAttackType}
            onSelectAttackType={setSelectedAttackType}
            attackTypes={ATTACK_TYPES}
            isPinned={true}
            onTogglePin={() => setControlPanelPinned(false)}
          />
        )}
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
          <MapVisualizer selectedServer={selectedServer} attacks={attacks} />
        </div>

        {/* Floating Zones for Unpinned Panels */}
        {!controlPanelPinned && (
          <div className="absolute top-0 left-0 z-50 p-8">
            <ControlPanel
              selectedServer={selectedServer}
              onSelectServer={setSelectedServer}
              onToggleAttack={() => setIsAttacking(!isAttacking)}
              isAttacking={isAttacking}
              selectedAttackType={selectedAttackType}
              onSelectAttackType={setSelectedAttackType}
              attackTypes={ATTACK_TYPES}
              isPinned={false}
              onTogglePin={() => setControlPanelPinned(true)}
            />
          </div>
        )}

        {!statsPanelPinned && (
          <div className="absolute bottom-0 right-0 z-50 p-8">
            <StatsPanel
              isAttacking={isAttacking}
              attacks={attacks}
              isPinned={false}
              onTogglePin={() => setStatsPanelPinned(true)}
            />
          </div>
        )}
      </div>

      {/* --- RIGHT SIDEBAR (Info & Stats) --- */}
      <div
        className={`h-full z-20 transition-all duration-300 flex flex-col p-4 pt-8 gap-4 ${statsPanelPinned ? 'w-[400px] border-l border-cyber-dim/30 bg-black/20 backdrop-blur-sm' : 'w-0 p-0 overflow-hidden'}`}
      >
        {statsPanelPinned && (
          <>
            <StatsPanel
              isAttacking={isAttacking}
              attacks={attacks}
              isPinned={true}
              onTogglePin={() => setStatsPanelPinned(false)}
            />
          </>
        )}

        {/* Always show Info Panel here if space allows, or allow it to collapse if stats are unpinned? 
            For now, let's keep InfoPanel in the right sidebar always visible unless customized further.
            Actually, if Stats is unpinned, the right sidebar closes. Let's make the Sidebar toggle-able independent of Stats?
            For simplicity: Right sidebar is controlled by StatsPanel pinning. If Stats is unpinned, sidebar closes and InfoPanel hides (or could float).
            Let's keep InfoPanel tied to the Sidebar for now.
        */}
        {statsPanelPinned && (
          <InfoPanel selectedAttackType={selectedAttackType} />
        )}
      </div>

    </div>
  );
}

export default App;
