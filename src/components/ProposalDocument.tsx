import React from 'react';
import { BudgetResult } from '../types';
import { COMPANY_INFO } from '../data/sinapi';
import { formatCurrency } from '../utils';
import { HardHat, MapPin, Calendar, Clock, CheckCircle2, Building2 } from 'lucide-react';

interface ProposalDocumentProps {
  result: BudgetResult;
}

export function ProposalDocument({ result }: ProposalDocumentProps) {
  const { input, totalCost, totalMaterialCost, totalLaborCost, costPerM2, estimatedDeadline, materials } = result;
  const hideM2 = localStorage.getItem('admin_hide_m2') === 'true';

  return (
    <div className="bg-white text-zinc-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 selection:bg-blue-100">
      {/* Cover Page */}
      <div className="relative min-h-[600px] bg-[#0A0A0B] flex flex-col items-center justify-center p-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="bg-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(37,99,235,0.5)]">
            <HardHat className="w-12 h-12 text-blue-50" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-blue-50 uppercase">
              Proposta
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full" />
          </div>

          <div className="space-y-2">
            <p className="text-blue-300/70 uppercase tracking-[0.4em] font-black text-sm">Preparado para</p>
            <h2 className="text-4xl font-black text-blue-50">{input.clientName}</h2>
            <div className="flex flex-col items-center gap-1">
              {input.clientPhone && <p className="text-blue-200/50 font-bold tracking-wider">{input.clientPhone}</p>}
              {input.clientEmail && <p className="text-blue-200/50 font-bold tracking-wider">{input.clientEmail}</p>}
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">{input.city}, {input.state}</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">{new Date(input.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            // Secret admin trigger: click the copyright text 5 times
            const clicks = Number(sessionStorage.getItem('admin_clicks') || 0) + 1;
            if (clicks >= 5) {
              sessionStorage.removeItem('admin_clicks');
              window.dispatchEvent(new CustomEvent('open-admin'));
            } else {
              sessionStorage.setItem('admin_clicks', clicks.toString());
              setTimeout(() => sessionStorage.removeItem('admin_clicks'), 2000);
            }
          }}
          className="absolute bottom-12 left-0 right-0 text-center cursor-default"
        >
          <p className="text-blue-400 font-black tracking-widest uppercase text-xs">Visar Construtora &copy; 2026</p>
        </button>
      </div>

      {/* House Image Page */}
      {result.imageUrl && (
        <div className="p-12 md:p-20 bg-zinc-900 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-blue-50 uppercase tracking-tighter">Visualização 3D Sugerida</h3>
            <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest">Conceito arquitetônico baseado nas suas escolhas</p>
          </div>
          <div className="relative group max-w-5xl w-full">
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <img 
              src={result.imageUrl} 
              alt="Conceito da Casa" 
              className="relative z-10 w-full rounded-[40px] shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Institutional Page */}
      <div className="p-12 md:p-20 space-y-12 bg-zinc-50">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-4 text-blue-600">
            <Building2 className="w-8 h-8" />
            <h3 className="text-2xl font-black uppercase tracking-tight">Sobre a Empresa</h3>
          </div>
          <p className="text-xl text-zinc-600 leading-relaxed font-medium italic">
            "{COMPANY_INFO.description}"
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-200">
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest mb-1">CNPJ</p>
              <p className="font-bold text-zinc-900">{COMPANY_INFO.cnpj}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest mb-1">Website</p>
              <p className="font-bold text-zinc-900">{COMPANY_INFO.website}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details Page */}
      <div className="p-12 md:p-20 space-y-16">
        <div className="space-y-12">
          <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter border-b-4 border-blue-600 inline-block pb-2">Resumo do Projeto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <DetailItem label="Área Total" value={`${input.area} m²`} />
              <DetailItem label="Padrão de Acabamento" value={input.standard.toUpperCase()} />
              <DetailItem label="Tipo de Fundação" value={input.foundation.toUpperCase()} />
              <DetailItem label="Cobertura" value={`${input.roof.toUpperCase()} (${input.roofStructure})`} />
              <DetailItem label="Estilo da Fachada" value={input.facadeStyle.toUpperCase()} />
            </div>
            <div className="space-y-6">
              <DetailItem label="Dimensões do Lote" value={`${input.lotWidth}m x ${input.lotLength}m`} />
              <DetailItem label="Pintura Interna" value={input.internalPaintFinish.toUpperCase()} />
              <DetailItem label="Cores (Parede/Teto)" value={`${input.wallPaintColor} / ${input.ceilingPaintColor}`} />
              <DetailItem label="Revestimento Externo" value={input.externalCoating.toUpperCase()} />
              <DetailItem label="Bancadas" value={`${input.countertopType} (${input.countertopStone})`} />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter border-b-4 border-blue-600 inline-block pb-2">Investimento Estimado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PriceCard label="Materiais" value={totalMaterialCost} color="text-zinc-600" />
            <PriceCard label="Mão de Obra" value={totalLaborCost} color="text-blue-600" />
            <PriceCard label="Total Geral" value={totalCost} color="text-zinc-900" highlight />
          </div>

          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-[10px] uppercase font-black text-blue-600/50 tracking-widest">Prazo de Execução</p>
                <p className="text-2xl font-black text-blue-900">{estimatedDeadline}</p>
              </div>
            </div>
            <div className="text-right">
              {!hideM2 && (
                <>
                  <p className="text-[10px] uppercase font-black text-blue-600/50 tracking-widest">Custo por m²</p>
                  <p className="text-2xl font-black text-blue-900">{formatCurrency(costPerM2)}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Principais Insumos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.filter(m => m.materialPrice > 0).slice(0, 10).map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-zinc-700">{m.name}</span>
                <span className="ml-auto text-zinc-400 font-medium">{m.quantity} {m.unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-20 text-center space-y-8">
          <div className="h-px bg-zinc-200 w-full" />
          <div className="flex flex-col items-center gap-4">
            <div className="bg-zinc-900 p-3 rounded-xl">
              <HardHat className="w-8 h-8 text-blue-50" />
            </div>
            <div>
              <p className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Visar Construtora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
      <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className="font-bold text-zinc-900">{value}</span>
    </div>
  );
}

function PriceCard({ label, value, color, highlight }: { label: string; value: number; color: string; highlight?: boolean }) {
  return (
    <div className={`p-8 rounded-[32px] ${highlight ? 'bg-zinc-900 text-white shadow-2xl scale-105' : 'bg-zinc-50 border border-zinc-100'}`}>
      <p className={`text-[10px] uppercase font-black tracking-widest mb-2 ${highlight ? 'text-blue-400' : 'text-zinc-400'}`}>{label}</p>
      <p className={`text-3xl font-black ${highlight ? 'text-white' : color}`}>{formatCurrency(value)}</p>
    </div>
  );
}
