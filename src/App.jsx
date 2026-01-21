import React, { useState, useEffect, useRef } from 'react';
import MapVisualizer from './components/Map/MapVisualizer';
import ControlPanel from './components/UI/ControlPanel';
import StatsPanel from './components/UI/StatsPanel';
import InfoPanel from './components/UI/InfoPanel';
import BootScreen from './components/UI/BootScreen';
import DefensePanel from './components/UI/DefensePanel';
import PacketInspector from './components/UI/PacketInspector';
import { Terminal } from 'lucide-react';

function App() {
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState('RANDOM');
  const [attacks, setAttacks] = useState([]); // Visual state (throttled)
  const [booting, setBooting] = useState(true);

  // Educational State
  const [activeDefenses, setActiveDefenses] = useState([]);
  const [showPacketInspector, setShowPacketInspector] = useState(false);

  // Buffer for high-frequency simulation
  const attacksBuffer = useRef([]);

  // Attack Configuration
  const ATTACK_TYPES = [
    { type: 'UDP_FLOOD', color: '#ff003c' },
    { type: 'SQL_INJECTION', color: '#ffee00' },
    { type: 'HTTP_POST', color: '#00f0ff' },
    { type: 'DATA_EXFIL', color: '#ae00ff' }
  ];

  // Defense Handlers
  const toggleDefense = (id) => {
    setActiveDefenses(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  // 1. Simulation Loop (High Frequency, Updates Ref only)
  useEffect(() => {
    let simInterval;
    if (isAttacking && selectedServer) {
      simInterval = setInterval(() => {
        // DEFENSE LOGIC: Filter traffic based on active defenses
        if (activeDefenses.includes('BLACKHOLE')) return; // Drop all

        // Effect chance of blocking
        let dropChance = 0;
        if (activeDefenses.includes('RATE_LIMIT')) dropChance += 0.3; // 30% drop
        if (activeDefenses.includes('ANYCAST')) dropChance += 0.2; // 20% drop

        // WAF specifically hurts SQL_INJECTION and HTTP_POST
        if (activeDefenses.includes('WAF') && (selectedAttackType === 'SQL_INJECTION' || selectedAttackType === 'HTTP_POST' || selectedAttackType === 'RANDOM')) {
          dropChance += 0.4;
        }

        if (Math.random() < dropChance) return; // Mitigation successful

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
        if (attacksBuffer.current.length > 200) { // Safety cap
          attacksBuffer.current = attacksBuffer.current.filter(a => now - a.createdAt < 2000);
        }

      }, 50); // Run at 20Hz
    } else {
      attacksBuffer.current = [];
    }
    return () => clearInterval(simInterval);
  }, [isAttacking, selectedServer, selectedAttackType, activeDefenses]); // Add activeDefenses dependency

  // 2. Render Loop (Lower Frequency, Syncs Ref to State)
  useEffect(() => {
    let renderInterval;
    if (isAttacking) {
      renderInterval = setInterval(() => {
        const now = Date.now();
        attacksBuffer.current = attacksBuffer.current.filter(a => now - a.createdAt < 2000);
        setAttacks([...attacksBuffer.current]);
      }, 100);
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
        className="h-full z-20 w-[360px] border-r border-cyber-dim/30 bg-black/20 backdrop-blur-sm flex flex-col p-4 pt-8 gap-4 overflow-y-auto custom-scrollbar"
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
        <DefensePanel
          activeDefenses={activeDefenses}
          onToggleDefense={toggleDefense}
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
          <MapVisualizer selectedServer={selectedServer} attacks={attacks} />
        </div>

        {/* Packet Inspector Toggle (Bottom Floating) */}
        {!booting && (
          <button
            onClick={() => setShowPacketInspector(!showPacketInspector)}
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-dim/50 bg-black/80 text-cyber-cyan font-mono text-xs uppercase tracking-widest hover:bg-cyber-cyan/10 transition-all ${showPacketInspector ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Terminal size={14} />
            Open Packet Sniffer
          </button>
        )}
      </div>

      {/* --- RIGHT SIDEBAR (Info & Stats) --- */}
      <div
        className="h-full z-20 w-[400px] border-l border-cyber-dim/30 bg-black/20 backdrop-blur-sm flex flex-col p-4 pt-8 gap-4 overflow-y-auto custom-scrollbar"
      >
        <StatsPanel isAttacking={isAttacking} attacks={attacks} activeDefenses={activeDefenses} />
        <InfoPanel selectedAttackType={selectedAttackType} />
      </div>

      <PacketInspector
        isVisible={showPacketInspector}
        onClose={() => setShowPacketInspector(false)}
        attackType={selectedAttackType}
        isAttacking={isAttacking}
        activeDefenses={activeDefenses}
      />

    </div>
  );
}

export default App;
