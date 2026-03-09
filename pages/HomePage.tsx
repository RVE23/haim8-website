import React from 'react';
import { Hero } from '../components/Hero';
import { GradientBackground } from '../components/GradientBackground';
import { PageType } from '../App';

interface HomePageProps {
    onNavigate: (page: PageType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="relative overflow-x-hidden min-h-screen">
            <GradientBackground />
            <Hero />

            {/* Featured Solutions Section Preview */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-20 tracking-tight">
                    Three Dedicated <span className="text-[#3b82f6]">Engines</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { id: 'ai-concierge', title: 'AI Concierge', desc: 'Smarter customer interactions.', color: 'from-[#0080E4] to-[#3b82f6]' },
                        { id: 'gtm-engine', title: 'GTM Engine', desc: 'Accelerate go-to-market.', color: 'from-[#3b82f6] to-[#7D41B9]' },
                        { id: 'bpa', title: 'BPA', desc: 'Business Process Automation.', color: 'from-[#7D41B9] to-[#bf41b9]' }
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onNavigate(item.id as PageType)}
                            className="cursor-pointer group flex flex-col p-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all shadow-xl hover:shadow-[#3b82f6]/5"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} mb-8 flex items-center justify-center`}>
                                <div className="w-6 h-6 bg-white/30 rounded-full blur-[2px]" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#3b82f6] transition-colors">{item.title}</h3>
                            <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors leading-relaxed">{item.desc}</p>

                            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                Explore Solution <span className="text-xl">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust & Stats Section */}
            <section className="relative z-10 py-24 bg-white/5 border-y border-white/5 mb-32">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <p className="text-sm font-bold text-[#3b82f6] uppercase tracking-[0.2em] mb-12 italic opacity-60">Empowering business with AI</p>
                    <div className="flex flex-wrap justify-center gap-16 md:gap-32 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        {/* Logos Placeholder */}
                        {['Inbound', 'Supabase', 'Vercel', 'Stripe', 'Figma'].map((brand) => (
                            <span key={brand} className="text-2xl font-black text-white tracking-tighter opacity-70">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
