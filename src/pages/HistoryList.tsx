import React from 'react';
import { BudgetResult } from '../types';
import { formatCurrency } from '../utils';
import { Calendar, MapPin, ChevronRight, Trash2, Search } from 'lucide-react';

interface HistoryProps {
  history: BudgetResult[];
  onSelect: (budget: BudgetResult) => void;
  onDelete: (id: string) => void;
}

export function HistoryList({ history, onSelect, onDelete }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="bg-zinc-900/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-xl">
          <Search className="w-10 h-10 text-blue-400/30" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-blue-50">Nenhum orçamento encontrado</h3>
          <p className="text-blue-300/50 font-medium">Você ainda não criou nenhum orçamento. Comece agora!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight text-blue-50">Histórico de Orçamentos</h2>
        <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
          {history.length} {history.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((budget) => (
          <div 
            key={budget.input.id}
            className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all group relative shadow-xl hover:shadow-blue-500/5"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-blue-100 group-hover:text-blue-400 transition-colors">
                  {budget.input.clientName}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-blue-300/50 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {budget.input.city}, {budget.input.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(budget.input.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(budget.input.id);
                }}
                className="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Excluir"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                <div className="text-[10px] uppercase font-black text-blue-400/50 tracking-widest mb-1">Área</div>
                <div className="text-xl font-black text-blue-50">{budget.input.area} m²</div>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                <div className="text-[10px] uppercase font-black text-blue-400/50 tracking-widest mb-1">Total</div>
                <div className="text-xl font-black text-blue-400">{formatCurrency(budget.totalCost)}</div>
              </div>
            </div>

            <button 
              onClick={() => onSelect(budget)}
              className="w-full py-4 rounded-2xl bg-white/5 text-blue-100 font-black text-sm hover:bg-blue-600 hover:text-blue-50 transition-all flex items-center justify-center gap-3 border border-white/5 hover:border-blue-500/50"
            >
              Ver Detalhes Completos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
