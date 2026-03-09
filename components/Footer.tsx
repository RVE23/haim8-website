import React from 'react';
import { PageType } from '../App';

interface FooterProps {
    onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="relative z-10 pt-32 pb-16 px-6 border-t border-white/5 bg-[#0A0E1A]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black text-white mb-6">HA<span className="text-[#3b82f6]">I</span>M8</h3>
                        <p className="text-gray-400 leading-relaxed mb-8 max-w-xs text-sm">
                            The AI Orchestration Platform for modern SMEs. Turning isolated tools into coordinated business intelligence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button></li>
                            <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">How it Works</button></li>
                            <li><button onClick={() => onNavigate('customers')} className="hover:text-white transition-colors">Customers</button></li>
                            <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Solutions</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><button onClick={() => onNavigate('ai-concierge')} className="hover:text-white transition-colors">AI Concierge</button></li>
                            <li><button onClick={() => onNavigate('gtm-engine')} className="hover:text-white transition-colors">GTM Engine</button></li>
                            <li><button onClick={() => onNavigate('bpa')} className="hover:text-white transition-colors">Business Process Automation</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /></span>
                                contact@haim8.com
                            </li>
                            <li>London, United Kingdom</li>
                            <li><button onClick={() => onNavigate('contact')} className="text-[#3b82f6] font-bold">Book a Call →</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-xs">© 2026 HAIM8 Limited. All rights reserved.</p>
                    <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-[0.1em]">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
