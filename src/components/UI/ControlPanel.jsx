import React, { useState } from 'react';
import { Shield, ChevronUp, ChevronDown, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVER_LIST = [
    { id: "US-East", flag: "https://flagcdn.com/w40/us.png", name: "US-East" },
    { id: "US-West", flag: "https://flagcdn.com/w40/us.png", name: "US-West" },
    { id: "EU-West", flag: "https://flagcdn.com/w40/eu.png", name: "EU-West" },
    { id: "Asia-Pac", flag: "https://flagcdn.com/w40/jp.png", name: "Asia-Pac" },
    { id: "SA-East", flag: "https://flagcdn.com/w40/br.png", name: "SA-East" },
];

const ControlPanel = ({
    selectedServer,
    onSelectServer,
    onToggleAttack,
    isAttacking,
    selectedAttackType,
    onSelectAttackType,
    attackTypes,
    isPinned,       // New prop
    onTogglePin     // New prop
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    // Removed internal isPinned state

    return (
        <motion.div
            drag={!isPinned} // Only drag if NOT pinned
            dragMomentum={false}
            // Remove hard constraints when unpinned to allow free movement, or update them
            dragConstraints={!isPinned ? { left: 0, top: 0, right: window.innerWidth - 320, bottom: window.innerHeight - 100 } : undefined}
            className={`
                z-50 w-full rounded-xl overflow-hidden cyber-panel transition-all duration-300 
                ${isPinned ? 'relative mb-4' : 'absolute top-8 left-8 cursor-move ring-1 ring-cyber-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.3)]'}
            `}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, width: '100%' }} // Ensure consistent width
        >
            {/* Header */}
            <div
                className={`p-4 flex items-center justify-between border-b border-cyber-dim/30 bg-black/20 group select-none ${!isPinned ? 'cursor-move' : ''}`}
                style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
            >
                <div className="flex items-center gap-3">
                    <Shield className="text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" size={20} style={{ color: '#00f0ff' }} />
                    <h2 className="text-lg font-bold tracking-wider font-mono text-white text-glow">LOIC_V3</h2>
                </div>
                <div className="flex items-center gap-3">
                    {/* Pin Toggle */}
                    <button
                        onClick={onTogglePin}
                        className={`transition-all duration-300 p-1.5 rounded-full hover:bg-white/10 ${isPinned ? 'text-cyber-cyan' : 'text-gray-500'}`}
                        title={isPinned ? "Unpin to drag" : "Pin position"}
                    >
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isPinned ? 'bg-cyber-cyan shadow-[0_0_8px_#00f0ff]' : 'border border-gray-500 bg-transparent'}`} />
                    </button>

                    {!isPinned && <GripHorizontal size={16} className="text-gray-400 group-hover:text-cyber-cyan transition-colors" />}

                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-400 hover:text-white transition-colors"
                        onPointerDownCapture={e => e.stopPropagation()}
                    >
                        {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-6 pt-4 space-y-6">

                            {/* Server Selection */}
                            <div>
                                <label className="block text-[10px] font-mono mb-3 uppercase tracking-[0.2em] text-cyber-cyan/70" style={{ color: '#00f0ff' }}>Target Server</label>
                                <div className="space-y-2">
                                    {SERVER_LIST.map(server => (
                                        <button
                                            key={server.id}
                                            onClick={() => onSelectServer(server.id)}
                                            className={`
                                                w-full px-4 py-3 flex items-center justify-between
                                                font-mono text-sm transition-all duration-300
                                                border border-transparent hover:border-cyber-cyan/30 hover:bg-white/5
                                                rounded-md
                                                ${selectedServer === server.id ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-gray-400'}
                                            `}
                                            style={{ borderColor: selectedServer === server.id ? '#00f0ff' : 'transparent' }}
                                        >
                                            <span className="flex items-center gap-3">
                                                <img src={server.flag} alt="flag" className="w-5 h-auto rounded opacity-80" />
                                                <span className="tracking-wide">{server.name}</span>
                                            </span>
                                            {selectedServer === server.id && <span className="animate-pulse text-cyber-cyan">●</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Attack Method Selection */}
                            <div>
                                <label className="block text-[10px] font-mono mb-3 uppercase tracking-[0.2em] text-cyber-cyan/70" style={{ color: '#00f0ff' }}>Attack Vector</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => onSelectAttackType('RANDOM')}
                                        className={`cyber-button py-2 ${selectedAttackType === 'RANDOM' ? 'active' : ''}`}
                                    >
                                        RANDOM
                                    </button>
                                    {attackTypes && attackTypes.map(type => (
                                        <button
                                            key={type.type}
                                            onClick={() => onSelectAttackType(type.type)}
                                            className={`cyber-button py-2 ${selectedAttackType === type.type ? 'active' : ''}`}
                                        // Override color for active state if needed, or stick to blue theme
                                        // Ideally we pass color as prop or inline style if we want specific colors per button
                                        >
                                            {type.type.split('_')[0]} {/* Shorten name */}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={onToggleAttack}
                                disabled={!selectedServer}
                                className={`cyber-button danger w-full py-4 text-sm ${isAttacking ? 'active' : ''}`}
                            >
                                {isAttacking ? 'Stop Attack' : 'Initiate Attack'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ControlPanel;
