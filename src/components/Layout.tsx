import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, History, PlusCircle, Home as HomeIcon, HardHat, Menu, X } from 'lucide-react';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'new';
  view: string;
  onTabChange: (tab: 'home' | 'new') => void;
  onAdmin?: () => void;
}

export function Layout({ children, activeTab, view, onTabChange, onAdmin }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-blue-100 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 no-print">
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
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'home', label: 'Início', icon: HomeIcon },
              { id: 'new', label: 'Novo Orçamento', icon: PlusCircle },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-zinc-950/50 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <HardHat className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-black tracking-tighter uppercase text-blue-100">Visar Construtora</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-blue-400/30 uppercase tracking-widest">
            <button type="button" onClick={onAdmin} className="hover:text-blue-400 transition-colors">Administração</button>
            <span className="cursor-default">&copy; 2026 Visar Construtora</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5561999547241"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(22,163,74,0.4)] hover:bg-green-500 hover:scale-110 transition-all group no-print"
        title="Falar com a Visar Construtora"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-zinc-900 text-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none">
          Falar com Consultor
        </span>
      </a>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-[#141416]/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[32px] flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] no-print">
        {[
          { id: 'home', label: 'Início', icon: HomeIcon },
          { id: 'new', label: 'Novo', icon: PlusCircle },
        ].map((item) => (
          <button 
            key={item.id}
            type="button"
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
