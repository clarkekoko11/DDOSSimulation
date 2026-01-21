import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, GripHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatsPanel = ({
    isAttacking,
    attacks = []
}) => {
    const [stats, setStats] = useState({
        bandwidth: 0,
        requests: 0,
        packets: 0,
    });
    const [isMinimized, setIsMinimized] = useState(false);
    // Removed internal isPinned state
    const breakdown = useMemo(() => {
        const counts = { 'UDP_FLOOD': 0, 'SQL_INJECTION': 0, 'HTTP_POST': 0, 'DATA_EXFIL': 0 };
        attacks.forEach(a => {
            if (counts[a.type] !== undefined) counts[a.type]++;
        });
        return counts;
    }, [attacks]);

    useEffect(() => {
        let interval;
        if (isAttacking) {
            interval = setInterval(() => {
                setStats(prev => ({
                    bandwidth: prev.bandwidth + Math.random() * 50,
                    requests: prev.requests + Math.random() * 10000,
                    packets: prev.packets + Math.random() * 50000,
                }));
            }, 100);
        } else {
            interval = setInterval(() => {
                setStats(prev => ({
                    bandwidth: Math.max(0, prev.bandwidth * 0.9),
                    requests: Math.max(0, prev.requests * 0.9),
                    packets: Math.max(0, prev.packets * 0.9),
                }));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isAttacking]);

    return (
        <motion.div
            className="z-50 w-full rounded-xl overflow-hidden cyber-panel transition-all duration-300 relative mb-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, width: '100%' }}
        >
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between border-b border-cyber-dim/30 bg-black/20 group select-none"
                style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
            >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-400">
                    <Activity size={14} className="text-cyber-cyan" style={{ color: '#00f0ff' }} />
                    Live Metrics
                </div>
                <div className="flex items-center gap-3">
                    {isAttacking && (
                        <span className="flex h-2 w-2 relative mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-6 space-y-4">
                            <StatRow icon={Zap} label="Bandwidth" value={stats.bandwidth.toFixed(2)} unit="Gbps" color="#00f0ff" />
                            <StatRow icon={Activity} label="Requests" value={Math.floor(stats.requests).toLocaleString()} unit="req/s" color="#39ff14" />
                            <StatRow icon={TrendingUp} label="Packet Flow" value={Math.floor(stats.packets).toLocaleString()} unit="pps" color="#ff003c" />

                            {/* Attack Methods Breakdown */}
                            <div className="border-t pt-4 mt-2" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                                <h4 className="text-[10px] font-mono uppercase mb-3 text-gray-500 tracking-widest">Attack Vectors</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <MethodBadge label="UDP" count={breakdown['UDP_FLOOD']} color="#ff003c" />
                                    <MethodBadge label="SQLi" count={breakdown['SQL_INJECTION']} color="#ffee00" />
                                    <MethodBadge label="HTTP" count={breakdown['HTTP_POST']} color="#00f0ff" />
                                    <MethodBadge label="DATA" count={breakdown['DATA_EXFIL']} color="#ae00ff" />
                                </div>
                            </div>

                            {isAttacking && (
                                <div className="mt-2 border-t pt-3 flex items-center justify-between animate-pulse" style={{ borderColor: 'rgba(255, 0, 60, 0.3)' }}>
                                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#ff003c' }}>Target Status:</span>
                                    <span className="font-bold font-mono tracking-widest text-sm flex items-center gap-2" style={{ color: '#ff003c' }}>
                                        <AlertTriangle size={14} /> CRITICAL
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const MethodBadge = ({ label, count, color }) => (
    <div className="flex justify-between items-center text-xs font-mono p-2 rounded bg-black/40 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: color }} />
        <span style={{ color }} className="ml-2 font-bold opacity-90">{label}</span>
        <span className="font-mono text-gray-300">{count}</span>
    </div>
);

const StatRow = ({ icon: Icon, label, value, unit, color }) => (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-3 text-gray-400">
            <Icon size={16} />
            <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
        </div>
        <div className="font-mono font-bold text-lg" style={{ color, textShadow: `0 0 10px ${color}40` }}>
            {value} <span className="text-xs opacity-50 ml-1">{unit}</span>
        </div>
    </div>
);

export default StatsPanel;
