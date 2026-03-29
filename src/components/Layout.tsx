import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, History, PlusCircle, Home as HomeIcon, HardHat, Menu, X } from 'lucide-react';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'new' | 'history';
  onTabChange: (tab: 'home' | 'new' | 'history') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-blue-100 font-sans selection:bg-blue-500/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
              <HardHat className="w-6 h-6 text-blue-50" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-blue-100">
                VISAR <span className="text-blue-400">CONSTRUCALC</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400/70 leading-none">
                Engenharia Digital
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'home', label: 'Início', icon: HomeIcon },
              { id: 'new', label: 'Novo Orçamento', icon: PlusCircle },
              { id: 'history', label: 'Histórico', icon: History },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-white/10 text-blue-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
                    : 'text-blue-300/70 hover:text-blue-100 hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-400' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => onTabChange('new')}
            className="bg-blue-600 text-blue-50 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Orçamento</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-[#141416]/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[32px] flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {[
          { id: 'home', label: 'Início', icon: HomeIcon },
          { id: 'new', label: 'Novo', icon: PlusCircle },
          { id: 'history', label: 'Histórico', icon: History },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all", 
              activeTab === item.id ? "text-blue-400 scale-110" : "text-zinc-500"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
