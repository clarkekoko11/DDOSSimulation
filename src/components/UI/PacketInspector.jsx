import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Pause, X } from 'lucide-react';

const PacketInspector = ({ isVisible, onClose, attackType, isAttacking, activeDefenses = [] }) => {
    const [packets, setPackets] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const endRef = useRef(null);

    // Packet Generators
    const generatePacket = () => {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        const src = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

        let protocol = 'TCP';
        let payload = '';
        let len = 64;

        switch (attackType) {
            case 'UDP_FLOOD':
                protocol = 'UDP';
                len = 1024 + Math.floor(Math.random() * 4096);
                payload = `[MALFORMED_DATA_GRAM] ${Math.random().toString(16).substr(2, 20)}...`;
                break;
            case 'SQL_INJECTION':
                protocol = 'HTTP/1.1';
                payload = `GET /api/users?id=' OR '1'='1'--`;
                len = 512;
                break;
            case 'HTTP_POST':
                protocol = 'HTTP/1.1';
                payload = `POST /upload Content-Length: 99999999 [PARTIAL_BODY]`;
                len = 1200;
                break;
            case 'DATA_EXFIL':
                protocol = 'TCP';
                payload = `[OUTBOUND] user_db.dump > 44.12.99.112:8080`;
                len = 2048;
                break;
            default: // RANDOM
                protocol = 'TCP';
                payload = 'SYN_ACK';
        }

        return { id: Date.now() + Math.random(), time: timestamp, src, protocol, len, payload };
    };

    useEffect(() => {
        if (!isVisible || !isAttacking || isPaused) return;
        if (activeDefenses.includes('BLACKHOLE')) return; // Traffic Null-Routed

        const interval = setInterval(() => {
            setPackets(prev => {
                const newPacket = generatePacket();
                const updated = [...prev, newPacket];
                if (updated.length > 50) return updated.slice(updated.length - 50); // Keep last 50
                return updated;
            });
        }, 150); // Speed of logs

        return () => clearInterval(interval);
    }, [isVisible, isAttacking, isPaused, attackType, activeDefenses]);

    // Auto-scroll
    useEffect(() => {
        if (!isPaused && endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [packets, isPaused]);


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 w-2/3 max-w-4xl bg-black/90 border-t border-x border-cyber-dim shadow-[0_-5px_20px_rgba(0,0,0,0.8)] z-40 rounded-t-lg backdrop-blur"
                    style={{ borderColor: 'rgba(0,240,255,0.3)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 px-4 bg-cyber-dim/20 border-b border-cyber-dim/30">
                        <div className="flex items-center gap-2 text-cyber-cyan font-mono text-xs font-bold">
                            <Terminal size={14} />
                            NET_SNIFFER v1.0
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsPaused(!isPaused)} className="text-gray-400 hover:text-white p-1">
                                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Console View */}
                    <div className="h-48 overflow-y-auto p-3 font-mono text-[10px] text-gray-300 space-y-1 custom-scrollbar">
                        {packets.map(p => (
                            <div key={p.id} className="flex gap-4 opacity-90 hover:opacity-100 hover:bg-white/5 px-2">
                                <span className="text-gray-500 w-16">{p.time}</span>
                                <span className="text-cyber-secondary w-24">{p.src}</span>
                                <span className="text-yellow-500 w-16">{p.protocol}</span>
                                <span className="text-gray-400 w-16">LEN:{p.len}</span>
                                <span className="text-cyber-green flex-1 truncate">{p.payload}</span>
                            </div>
                        ))}
                        {activeDefenses.includes('BLACKHOLE') && isAttacking && (
                            <div className="text-red-500 font-bold animate-pulse">&gt;&gt; NULL_ROUTE ACTIVE: DROPPING ALL PACKETS...</div>
                        )}
                        {packets.length === 0 && !activeDefenses.includes('BLACKHOLE') && (
                            <div className="text-gray-600 italic">Waiting for traffic capture...</div>
                        )}
                        <div ref={endRef} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PacketInspector;
