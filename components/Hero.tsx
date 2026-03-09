import React from 'react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
            >
                {/* Glow behind logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0080E4]/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Sparkle Icon */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6 flex justify-center"
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17L5.5 22L8 14.5L2 9.5H9.5L12 2Z" fill="#3b82f6" fillOpacity="0.8" />
                    </svg>
                </motion.div>

                {/* Brand Text */}
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-4">
                    HA<span className="text-[#3b82f6]">I</span>M8
                </h1>

                <p className="max-w-xl mx-auto text-xl md:text-2xl font-medium text-gray-300 tracking-tight leading-relaxed">
                    Simplifying <span className="text-[#3b82f6] font-bold">AI</span> for <br className="hidden md:block" /> everyday business
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <button className="px-10 py-4 rounded-full bg-gradient-to-r from-[#0080E4] to-[#7D41B9] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                        Book a 7-day Pilot
                    </button>
                    <button className="px-10 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white font-medium text-lg hover:bg-white/10 transition-colors">
                        Our Solutions
                    </button>
                </motion.div>
            </motion.div>

            {/* Decorative blurred rings */}
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[120vw] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
        </section>
    );
};
