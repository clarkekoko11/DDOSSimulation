import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertOctagon, Server, Database, Activity } from 'lucide-react';

const ATTACK_INFO = {
    'RANDOM': {
        title: 'Randomized Protocol',
        desc: 'Cycles through all available attack vectors to test general system resilience against unpredictable patterns.',
        severity: 'Variable',
        tech: 'Multi-vector'
    },
    'UDP_FLOOD': {
        title: 'UDP Volumetric Flood',
        desc: 'Overwhelms the target with User Datagram Protocol packets. Since UDP is connectionless, the server must process each packet, consuming bandwidth and CPU.',
        severity: 'High (Bandwidth)',
        tech: 'Layer 4 (Transport)'
    },
    'SQL_INJECTION': {
        title: 'SQL Injection (Simulated)',
        desc: 'Attempts to manipulate backend databases via malformed queries. While not a flood, it simulates a breach attempt in the chaos.',
        severity: 'Critical (Data)',
        tech: 'Layer 7 (Application)'
    },
    'HTTP_POST': {
        title: 'HTTP POST Flood',
        desc: 'Sends massive amounts of POST requests with large bodies (e.g., file uploads), exhausting server memory and connection limits.',
        severity: 'Medium (Resource)',
        tech: 'Layer 7 (Application)'
    },
    'DATA_EXFIL': {
        title: 'Data Exfiltration',
        desc: 'Simulates unauthorized data transfer out of the network. Tracks outbound traffic anomalies.',
        severity: 'Critical (Privacy)',
        tech: 'Layer 7 (Application)'
    }
};

const InfoPanel = ({ selectedAttackType }) => {
    const info = ATTACK_INFO[selectedAttackType] || ATTACK_INFO['RANDOM'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full cyber-panel rounded-xl overflow-hidden mt-4"
        >
            <div className="p-4 border-b border-cyber-dim/30 bg-black/20 flex items-center gap-2">
                <Info size={16} className="text-cyber-accent" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest text-glow">
                    Attack Intelligence
                </h3>
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <h4 className="text-lg font-bold text-cyber-primary mb-1">{info.title}</h4>
                    <p className="text-xs text-gray-400 font-mono leading-relaxed">
                        {info.desc}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Severity</span>
                        <div className="flex items-center gap-2 text-cyber-secondary font-mono text-xs font-bold">
                            <AlertOctagon size={12} />
                            {info.severity}
                        </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vector</span>
                        <div className="flex items-center gap-2 text-cyber-accent font-mono text-xs font-bold">
                            <Activity size={12} />
                            {info.tech}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoPanel;
