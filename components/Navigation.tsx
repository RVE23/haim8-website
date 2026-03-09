import React from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { PageType } from '../App';

interface NavigationProps {
    currentPage: PageType;
    onNavigate: (page: PageType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const navItems: { label: string; id: PageType }[] = [
        { label: 'Home', id: 'home' },
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'Customers', id: 'customers' },
        { label: 'Pricing', id: 'pricing' },
        { label: 'About Us', id: 'about' },
        { label: 'Contact', id: 'contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-[#0A0E1A]/40 border border-white/5 rounded-full px-8 py-3">
                {/* Logo */}
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => onNavigate('home')}
                >
                    <span className="text-2xl font-bold tracking-tight text-white flex items-center">
                        HA<span className="text-[#0080E4]">I</span>M8
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`text-sm font-medium transition-colors hover:text-[#0080E4] ${currentPage === item.id ? 'text-[#0080E4]' : 'text-gray-400'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => onNavigate('contact')}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0080E4] to-[#7D41B9] text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,128,228,0.3)] transition-all"
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden mt-4 backdrop-blur-xl bg-[#0A0E1A]/90 border border-white/5 rounded-3xl p-6 flex flex-col gap-4"
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id);
                                setIsOpen(false);
                            }}
                            className={`text-lg font-medium ${currentPage === item.id ? 'text-[#0080E4]' : 'text-gray-300'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};
