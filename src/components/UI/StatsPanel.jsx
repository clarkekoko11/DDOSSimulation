import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsPanel = ({ isAttacking, attacks = [] }) => {
    const [stats, setStats] = useState({
        bandwidth: 0,
        requests: 0,
        packets: 0,
    });

    // Calculate breakdown from active attacks for visual feedback
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
        <div
            className="absolute bottom-4 right-4 z-50 w-96 p-4 rounded-lg flex flex-col gap-4 shadow-2xl"
            style={{
                backgroundColor: 'rgba(10, 10, 20, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                bottom: '20px',
                right: '20px'
            }}
        >
            <StatRow icon={Zap} label="Bandwidth" value={stats.bandwidth.toFixed(2)} unit="Gbps" color="#00f0ff" />
            <StatRow icon={Activity} label="Requests" value={Math.floor(stats.requests).toLocaleString()} unit="req/s" color="#39ff14" />
            <StatRow icon={TrendingUp} label="Packet Flow" value={Math.floor(stats.packets).toLocaleString()} unit="pps" color="#ff003c" />

            {/* Attack Methods Breakdown */}
            <div className="border-t pt-2" style={{ borderColor: 'rgba(42, 42, 53, 0.5)' }}>
                <h4 className="text-xs font-mono uppercase mb-2 text-gray-500">Attack Vectors</h4>
                <div className="grid grid-cols-2 gap-2">
                    <MethodBadge label="UDP" count={breakdown['UDP_FLOOD']} color="#ff003c" />
                    <MethodBadge label="SQLi" count={breakdown['SQL_INJECTION']} color="#ffee00" />
                    <MethodBadge label="HTTP" count={breakdown['HTTP_POST']} color="#00f0ff" />
                    <MethodBadge label="DATA" count={breakdown['DATA_EXFIL']} color="#ae00ff" />
                </div>
            </div>

            {isAttacking && (
                <div className="mt-2 border-t pt-2 flex items-center justify-between animate-pulse" style={{ borderColor: 'rgba(255, 0, 60, 0.3)' }}>
                    <span className="font-mono text-xs uppercase" style={{ color: '#ff003c' }}>Target Status:</span>
                    <span className="font-bold font-mono tracking-widest text-sm flex items-center gap-2" style={{ color: '#ff003c' }}>
                        <AlertTriangle size={14} /> CRITICAL
                    </span>
                </div>
            )}
        </div>
    );
};

const MethodBadge = ({ label, count, color }) => (
    <div className="flex justify-between items-center text-xs font-mono p-1 rounded" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}30` }}>
        <span style={{ color }}>{label}</span>
        <span className="font-bold text-gray-300">{count}</span>
    </div>
);

const StatRow = ({ icon: Icon, label, value, unit, color }) => (
    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'rgba(42, 42, 53, 0.5)' }}>
        <div className="flex items-center gap-2 text-gray-400">
            <Icon size={16} />
            <span className="text-xs font-mono uppercase">{label}</span>
        </div>
        <div className="font-mono font-bold text-lg" style={{ color }}>
            {value} <span className="text-xs opacity-70">{unit}</span>
        </div>
    </div>
);

export default StatsPanel;
