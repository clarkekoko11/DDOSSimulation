import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Server, AlertTriangle } from 'lucide-react';

const DEFENSES = [
    { id: 'RATE_LIMIT', label: 'Rate Limiting', icon: <Server size={16} />, desc: 'Caps RPM to mitigate Volumetric Floods.', cost: 'Med' },
    { id: 'WAF', label: 'Web Application Firewall', icon: <Shield size={16} />, desc: 'Filters Malicious HTTP/SQL patterns.', cost: 'High' },
    { id: 'ANYCAST', label: 'Anycast Network', icon: <Globe size={16} />, desc: 'Distributes traffic across global nodes.', cost: 'V. High' },
    { id: 'BLACKHOLE', label: 'Blackhole Routing', icon: <AlertTriangle size={16} />, desc: 'Drops ALL traffic to target (Last Resort).', cost: 'Extreme' },
];

const DefensePanel = ({ activeDefenses, onToggleDefense }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full cyber-panel rounded-xl overflow-hidden mb-4"
        >
            <div className="p-4 border-b border-cyber-dim/30 bg-black/20 flex items-center gap-2">
                <Lock size={16} className="text-cyber-cyan" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest text-glow">
                    Defense Systems
                </h3>
            </div>

            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {DEFENSES.map(def => {
                    const isActive = activeDefenses.includes(def.id);
                    return (
                        <button
                            key={def.id}
                            onClick={() => onToggleDefense(def.id)}
                            className={`
                                w-full p-3 rounded border text-left group transition-all duration-300
                                ${isActive
                                    ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                    : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/5'}
                            `}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`flex items-center gap-2 font-mono text-sm font-bold ${isActive ? 'text-cyber-cyan' : 'text-gray-300'}`}>
                                    {def.icon}
                                    {def.label}
                                </span>
                                <div className={`w-3 h-3 rounded-full border ${isActive ? 'bg-cyber-cyan border-cyber-cyan shadow-[0_0_5px_#00f0ff]' : 'bg-transparent border-gray-600'}`} />
                            </div>
                            <p className="text-[10px] text-gray-500 leading-tight mb-2 h-8">
                                {def.desc}
                            </p>
                            <div className="flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase">
                                <span>Status: <span className={isActive ? 'text-cyber-cyan' : 'text-gray-500'}>{isActive ? 'ACTIVE' : 'OFFLINE'}</span></span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default DefensePanel;
