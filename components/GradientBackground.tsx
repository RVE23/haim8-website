import React from 'react';

export const GradientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0A0E1A]">
            {/* Top Left Splash */}
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#0080E4] opacity-[0.08] blur-[120px]" />

            {/* Bottom Right Splash */}
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#7D41B9] opacity-[0.08] blur-[120px]" />

            {/* Center Subtle Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[#3b82f6] opacity-[0.03] blur-[150px]" />

            {/* Grid Pattern Mesh */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        </div>
    );
};
