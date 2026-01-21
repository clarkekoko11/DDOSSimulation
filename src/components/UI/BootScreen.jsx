import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const [step, setStep] = useState(0);

    // Matrix Rain Effect Generator
    useEffect(() => {
        const chars = '01ABCDEF';
        const generateLine = () => Array(Math.floor(Math.random() * 60)).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(' ');

        const interval = setInterval(() => {
            setLines(prev => {
                const newLines = [...prev, generateLine()];
                if (newLines.length > 20) return newLines.slice(1);
                return newLines;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Boot Sequence Timer
    useEffect(() => {
        const sequence = [
            setTimeout(() => setStep(1), 1000),   // BIOS
            setTimeout(() => setStep(2), 2500),  // Kernel
            setTimeout(() => setStep(3), 4000),  // Network
            setTimeout(() => setStep(4), 5500),  // Security
            setTimeout(() => setStep(5), 7500),  // Title Glitch
            setTimeout(() => setStep(6), 10500), // Hold
            setTimeout(onComplete, 12000)
        ];
        return () => sequence.forEach(clearTimeout);
    }, [onComplete]);

    const CheckItem = ({ delay, label }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 font-mono text-sm"
        >
            <span className="text-gray-500">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
            <span className="text-white">{label}</span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-cyber-green font-bold"
            >
                OK
            </motion.span>
        </motion.div>
    );

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 2.0, ease: "easeInOut" }}
        >
            {/* Background Matrix Rain */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
                {lines.map((line, i) => (
                    <div key={i} className="text-[10px] font-mono text-cyber-cyan whitespace-nowrap opacity-50">
                        {line}
                    </div>
                ))}
            </div>

            {/* Boot Log Sequence */}
            <AnimatePresence>
                {step < 5 && (
                    <motion.div
                        className="space-y-1 h-32"
                        exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                        transition={{ duration: 0.5 }}
                    >
                        {step >= 1 && <CheckItem label="INITIALIZING KERNEL..." />}
                        {step >= 2 && <CheckItem label="LOADING MODULES: NET_STACK_V3" />}
                        {step >= 3 && <CheckItem label="ESTABLISHING UPLINK (SECURE)" />}
                        {step >= 4 && <CheckItem label="BYPASSING FIREWALLS..." />}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Title Reveal (Absolute Center) */}
            <AnimatePresence>
                {step >= 5 && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-cyan tracking-tighter animate-pulse">
                            L.O.G.I.C
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="h-[2px] bg-cyber-cyan mt-4 mx-auto"
                        />
                        <p className="mt-4 text-cyber-cyan text-sm tracking-[0.5em] uppercase font-bold">
                            Layered Overload Generation & Impact Control
                        </p>
                        <p className="mt-8 text-gray-500 text-xs font-mono lowercase">
                            developed by clarke serrano
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20" />
        </motion.div>
    );
};

export default BootScreen;
