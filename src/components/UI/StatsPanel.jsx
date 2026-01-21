import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatsPanel = ({
    isAttacking,
    attacks = [],
    activeDefenses = []
}) => {
    const [stats, setStats] = useState({
        bandwidth: 0,
        requests: 0,
        packets: 0,
    });
    const [isMinimized, setIsMinimized] = useState(false);

    // Calculate Mitigation % based on defenses
    const mitigationLevel = useMemo(() => {
        if (!activeDefenses.length) return 0;
        let m = 0;
        if (activeDefenses.includes('BLACKHOLE')) return 100;
        if (activeDefenses.includes('RATE_LIMIT')) m += 30;
        if (activeDefenses.includes('ANYCAST')) m += 20;
        if (activeDefenses.includes('WAF')) m += 25;
        return Math.min(m, 95); // Cap at 95 unless blackholed
    }, [activeDefenses]);

    useEffect(() => {
        let interval;
        if (isAttacking) {
            interval = setInterval(() => {
                // Diminish stats based on mitigation
                const multiplier = 1 - (mitigationLevel / 100);

                setStats(prev => ({
                    bandwidth: prev.bandwidth + (Math.random() * 50 * multiplier),
                    requests: prev.requests + (Math.random() * 10000 * multiplier),
                    packets: prev.packets + (Math.random() * 50000 * multiplier),
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
    }, [isAttacking, mitigationLevel]);

    const formatNum = (n) => {
        if (n > 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n > 1000) return (n / 1000).toFixed(1) + 'K';
        return Math.floor(n);
    };

    return (
        <motion.div
            className="z-50 w-full rounded-xl overflow-hidden cyber-panel transition-all duration-300 relative mb-4 shrink-0"
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
                    {/* Mitigation Badge */}
                    {activeDefenses.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyber-green/20 border border-cyber-green/50 text-cyber-green text-[10px] font-bold">
                            <ShieldCheck size={10} />
                            MITIGATING {mitigationLevel}%
                        </div>
                    )}

                    {isAttacking && !activeDefenses.includes('BLACKHOLE') && (
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

            {/* Content */}
            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-6 space-y-6"
                    >
                        {/* Big Counter */}
                        <div className="text-center space-y-1">
                            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Bandwidth</div>
                            <div className="text-4xl font-black font-mono text-white text-glow">
                                {formatNum(stats.bandwidth)} <span className="text-lg text-gray-600">Gbps</span>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatRow label="RPS" value={formatNum(stats.requests)} icon={<TrendingUp size={14} />} color="#00f0ff" />
                            <StatRow label="PPS" value={formatNum(stats.packets)} icon={<AlertTriangle size={14} />} color="#ff003c" />
                        </div>

                        {/* Defense Status Overlay */}
                        {activeDefenses.includes('BLACKHOLE') && (
                            <div className="mt-4 p-2 bg-red-500/10 border border-red-500 text-red-500 text-center text-xs font-bold animate-pulse">
                                ⚠ TRAFFIC NULL-ROUTED ⚠
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const StatRow = ({ label, value, icon, color }) => (
    <div className="bg-white/5 rounded p-3 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-2 mb-1" style={{ color }}>
            {icon}
            <span className="text-[10px] font-bold tracking-wider">{label}</span>
        </div>
        <div className="text-xl font-mono text-gray-200">{value}</div>
    </div>
);

export default StatsPanel;
