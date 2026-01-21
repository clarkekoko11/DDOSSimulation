import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const sequence = [
            setTimeout(() => setStep(1), 500),  // Initial Glitch
            setTimeout(() => setStep(2), 1500), // Show Name
            setTimeout(() => setStep(3), 3500), // Fade Out
            setTimeout(() => onComplete(), 4000) // Complete
        ];
        return () => sequence.forEach(cleanup => clearTimeout(cleanup));
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
        >
            <div className="relative z-10 text-center">
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            className="font-mono"
                        >
                            <motion.h1
                                className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter"
                                animate={{ textShadow: ["0 0 0px #fff", "0 0 20px #00f0ff", "0 0 0px #fff"] }}
                                transition={{ duration: 0.2, repeat: 3 }}
                            >
                                SYSTEM BOOT
                            </motion.h1>

                            {step >= 2 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-cyber-cyan text-lg md:text-xl tracking-[0.5em] uppercase"
                                >
                                    <span className="text-gray-500 text-sm block mb-2 tracking-normal lowercase">made with love by</span>
                                    Clarke Serrano
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Loading Bar */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyber-cyan shadow-[0_0_10px_#00f0ff]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Matrix/Cyber Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
        </motion.div>
    );
};

export default BootScreen;
