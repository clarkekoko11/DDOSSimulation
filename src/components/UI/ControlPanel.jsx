import React from 'react';
import { Shield } from 'lucide-react';

const SERVER_LIST = [
    { id: "US-East", flag: "https://flagcdn.com/w40/us.png", name: "US-East" },
    { id: "US-West", flag: "https://flagcdn.com/w40/us.png", name: "US-West" },
    { id: "EU-West", flag: "https://flagcdn.com/w40/eu.png", name: "EU-West" },
    { id: "Asia-Pac", flag: "https://flagcdn.com/w40/jp.png", name: "Asia-Pac" },
    { id: "SA-East", flag: "https://flagcdn.com/w40/br.png", name: "SA-East" },
];

const ControlPanel = ({ selectedServer, onSelectServer, onToggleAttack, isAttacking }) => {
    return (
        <div
            className="absolute top-4 left-4 z-50 w-80 p-6 rounded-lg shadow-2xl"
            style={{
                backgroundColor: 'rgba(10, 10, 20, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                top: '20px',
                left: '20px'
            }}
        >
            <div className="flex items-center gap-3 mb-6">
                <Shield style={{ color: '#00f0ff' }} size={24} />
                <h2 className="text-xl font-bold tracking-wider font-mono" style={{ color: '#00f0ff' }}>LOIC_CONTROLLER</h2>
            </div>

            <div className="mb-6">
                <label className="block text-xs font-mono mb-2 uppercase tracking-widest" style={{ color: '#00f0ff' }}>Target Server</label>
                <div className="grid grid-cols-1 gap-2">
                    {SERVER_LIST.map(server => (
                        <button
                            key={server.id}
                            onClick={() => onSelectServer(server.id)}
                            style={{
                                backgroundColor: selectedServer === server.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                borderColor: selectedServer === server.id ? '#00f0ff' : '#2a2a35',
                                color: selectedServer === server.id ? '#00f0ff' : '#889',
                                border: '1px solid'
                            }}
                            className={`
                                px-4 py-3 text-left font-mono text-sm transition-all duration-300 flex justify-between items-center
                                ${selectedServer === server.id ? 'shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'hover:border-cyan-500/50 hover:text-cyan-400'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <img src={server.flag} alt="flag" className="w-5 h-auto rounded-sm opacity-80" />
                                <span>{server.name}</span>
                            </span>
                            {selectedServer === server.id && <span className="animate-pulse">●</span>}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onToggleAttack}
                disabled={!selectedServer}
                style={{
                    backgroundColor: !selectedServer ? '#333' : (isAttacking ? '#ff003c' : '#00f0ff'),
                    color: !selectedServer ? '#666' : '#000',
                    boxShadow: isAttacking ? '0 0 20px #ff003c' : (selectedServer ? '0 0 20px #00f0ff' : 'none')
                }}
                className={`
                    w-full py-4 text-center font-bold tracking-[0.2em] uppercase transition-all duration-300 clip-path-polygon
                    ${!selectedServer ? 'cursor-not-allowed' : 'hover:bg-white'}
                `}
            >
                {isAttacking ? 'Stop Attack' : 'Initiate Attack'}
            </button>
        </div>
    );
};

export default ControlPanel;
