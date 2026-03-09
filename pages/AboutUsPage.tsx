import React from 'react';
import { PageType } from '../App';
import { GradientBackground } from '../components/GradientBackground';

interface Props {
    onNavigate: (page: PageType) => void;
}

export const AboutUsPage: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0E1A] pt-32 px-6 flex flex-col items-center justify-center text-center">
            <GradientBackground />
            <h1 className="text-6xl font-black text-white relative z-10">About Us</h1>
            <p className="mt-8 text-xl text-gray-400 relative z-10 max-w-2xl">Elevate your customer experience with intelligent, 24/7 automation that feels human.</p>
            <button onClick={() => onNavigate('home')} className="mt-12 text-[#3b82f6] font-bold z-10 hover:underline transition-all">← Back to Home</button>
        </div>
    );
};
