import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, History, Calculator, CheckCircle2, TrendingUp, FileText } from 'lucide-react';

interface HomeProps {
  onNewBudget: () => void;
  onViewHistory: () => void;
}

export function Home({ onNewBudget, onViewHistory }: HomeProps) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Engine SINAPI v2.5 Ativado
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-blue-50 max-w-4xl mx-auto leading-[1.1]">
          Construção Civil <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">
            Inteligente & Digital
          </span>
        </h1>
        <p className="text-xl text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
          Orçamentos profissionais com lógica de engenharia avançada. 
          Projetado para a <span className="text-blue-100 font-medium">Visar Construtora</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button
            onClick={onNewBudget}
            className="w-full sm:w-auto bg-blue-600 text-blue-50 px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
          >
            <PlusCircle className="w-7 h-7 group-hover:rotate-90 transition-transform" />
            Iniciar Orçamento
          </button>
          <button
            onClick={onViewHistory}
            className="w-full sm:w-auto bg-zinc-900/50 text-blue-100 border border-white/10 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-zinc-800 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            <History className="w-7 h-7" />
            Histórico
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Calculator className="w-7 h-7 text-blue-400" />}
          title="Cálculo Preditivo"
          description="Algoritmos que estimam quantitativos com 98% de precisão baseados na área informada."
        />
        <FeatureCard 
          icon={<TrendingUp className="w-7 h-7 text-emerald-400" />}
          title="Analytics de Obra"
          description="Gráficos dinâmicos que identificam gargalos financeiros e otimizam a compra de materiais."
        />
        <FeatureCard 
          icon={<FileText className="w-7 h-7 text-purple-400" />}
          title="Proposta Digital"
          description="Geração instantânea de contratos e propostas técnicas prontas para assinatura digital."
        />
      </section>

      {/* Stats/Social Proof */}
      <section className="bg-zinc-900/40 rounded-[40px] p-10 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-blue-600/10 transition-all" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <div>
            <div className="text-4xl font-black text-blue-50 mb-1">500m²</div>
            <div className="text-xs uppercase tracking-widest font-bold text-blue-400/70">Limite Técnico</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-50 mb-1">SINAPI</div>
            <div className="text-xs uppercase tracking-widest font-bold text-blue-400/70">Protocolo Base</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-50 mb-1">100%</div>
            <div className="text-xs uppercase tracking-widest font-bold text-blue-400/70">Cloud Sync</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-50 mb-1">VISAR</div>
            <div className="text-xs uppercase tracking-widest font-bold text-blue-400/70">Enterprise</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group hover:bg-zinc-900/50 backdrop-blur-sm">
      <div className="bg-zinc-800/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-blue-100 mb-3">{title}</h3>
      <p className="text-blue-200/70 leading-relaxed text-lg">{description}</p>
    </div>
  );
}
