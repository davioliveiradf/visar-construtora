import React, { useState } from 'react';
import { BudgetResult } from '../types';
import { formatCurrency, formatNumber } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Share2, Copy, Check, ArrowLeft, FileText, LayoutGrid, BarChart3, Loader2 } from 'lucide-react';
import { generateProposalText } from '../services/budgetService';
import { ProposalDocument } from '../components/ProposalDocument';

interface BudgetResultViewProps {
  result: BudgetResult;
  onBack: () => void;
  isGeneratingImage?: boolean;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1', '#F97316'];

export function BudgetResultView({ result, onBack, isGeneratingImage }: BudgetResultViewProps) {
  const [viewMode, setViewMode] = useState<'summary' | 'details' | 'proposal'>('summary');
  const [copied, setCopied] = useState(false);

  const handleCopyProposal = () => {
    const text = generateProposalText(result);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = generateProposalText(result);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Orçamento - ${result.input.clientName}`,
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyProposal();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Item', 'Categoria', 'Quantidade', 'Unidade', 'Material (R$)', 'Mão de Obra (R$)', 'Total (R$)'];
    const rows = result.materials.map(m => [
      m.name,
      m.category,
      m.quantity,
      m.unit,
      m.materialPrice.toFixed(2),
      m.laborPrice.toFixed(2),
      m.totalPrice.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orcamento_${result.input.clientName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendWhatsApp = () => {
    const text = generateProposalText(result);
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5561999547241?text=${encodedText}`, '_blank');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadTXT = () => {
    const text = generateProposalText(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `proposta_${result.input.clientName.replace(/\s+/g, '_')}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hideM2 = localStorage.getItem('admin_hide_m2') === 'true';
  const customAdminImage = localStorage.getItem('admin_custom_image');
  
  // Force specific image for houses up to 100m2
  const displayImage = result.input.area <= 100 
    ? "https://i.imgur.com/Yy5TWtm.png" 
    : (customAdminImage || result.imageUrl);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button 
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 text-blue-300/70 hover:text-blue-100 hover:bg-zinc-800/50 rounded-xl transition-all font-bold uppercase tracking-widest text-[10px] border border-white/5 shadow-lg w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Histórico
        </button>
        <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
          <button 
            onClick={() => setViewMode('summary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'summary' ? 'bg-blue-600 text-blue-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-blue-300/70 hover:bg-white/5'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Resumo
          </button>
          <button 
            onClick={() => setViewMode('details')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'details' ? 'bg-blue-600 text-blue-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-blue-300/70 hover:bg-white/5'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Detalhes
          </button>
          <button 
            onClick={() => setViewMode('proposal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'proposal' ? 'bg-blue-600 text-blue-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-blue-300/70 hover:bg-white/5'}`}
          >
            <FileText className="w-4 h-4" />
            Proposta
          </button>
        </div>
      </div>

      {viewMode === 'summary' && (
        <div className="space-y-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl lg:col-span-2">
              <div className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-2">Valor Total Estimado</div>
              <div className="text-4xl font-black text-blue-50">{formatCurrency(result.totalCost)}</div>
              <div className="mt-3 text-[10px] text-blue-400 font-bold bg-blue-500/10 inline-block px-2 py-1 rounded-lg border border-blue-500/20">
                Base de Referência 2024/25
              </div>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
              <div className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-2">Total Materiais</div>
              <div className="text-2xl font-black text-blue-100">{formatCurrency(result.totalMaterialCost)}</div>
              <div className="mt-3 text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Insumos</div>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
              <div className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-2">Total Mão de Obra</div>
              <div className="text-2xl font-black text-blue-400">{formatCurrency(result.totalLaborCost)}</div>
              <div className="mt-3 text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Serviços</div>
            </div>
            {!hideM2 && (
              <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
                <div className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-2">Custo por m²</div>
                <div className="text-2xl font-black text-blue-50">{formatCurrency(result.costPerM2)}</div>
                <div className="mt-3 text-[10px] text-blue-400 font-bold bg-blue-500/10 inline-block px-2 py-1 rounded-lg border border-blue-500/20">
                  Padrão {result.input.standard.toUpperCase()}
                </div>
              </div>
            )}
            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
              <div className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-2">Prazo Estimado</div>
              <div className="text-2xl font-black text-blue-50">{result.estimatedDeadline}</div>
              <div className="mt-3 text-[10px] text-blue-400 font-bold bg-blue-500/10 inline-block px-2 py-1 rounded-lg border border-blue-500/20">
                Obra Completa
              </div>
            </div>
          </div>

          {/* House Image Preview */}
          {(displayImage || isGeneratingImage) && (
            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-[40px] border border-white/10 shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video bg-zinc-950/50 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt="Conceito da Casa" 
                      className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-blue-400/30">
                      <Loader2 className="w-12 h-12 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Gerando Visualização 3D...</p>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-blue-50 uppercase tracking-tighter">Conceito Arquitetônico</h3>
                    <p className="text-blue-400/50 text-sm font-bold uppercase tracking-widest">Gerado por IA para Visar Construtora</p>
                  </div>
                  <p className="text-blue-100/70 leading-relaxed italic">
                    "Esta visualização representa uma interpretação artística baseada nas especificações técnicas do seu projeto, 
                    proporcionando uma visão clara do potencial estético da sua futura obra."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Room Composition Summary */}
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-6">Composição da Obra</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { val: result.input.bedrooms, label: 'Quartos' },
                { val: result.input.suites, label: 'Suítes' },
                { val: result.input.bathrooms, label: 'Banheiros' },
                { val: result.input.kitchens, label: 'Cozinhas' },
                { val: result.input.serviceAreas, label: 'Área Serv.' },
                { val: result.input.halls, label: 'Halls' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                  <div className="text-2xl font-black text-blue-100">{item.val}</div>
                  <div className="text-[10px] text-blue-400/50 uppercase font-bold tracking-tighter">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-xl font-black text-blue-50 mb-6">Distribuição de Custos</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="total"
                      nameKey="name"
                      stroke="none"
                    >
                      {result.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#141416', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#bfdbfe' }}
                    />
                    <Legend wrapperStyle={{ color: '#bfdbfe' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-xl font-black text-blue-50 mb-6">Custos por Categoria (R$)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.categories} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#93c5fd' }} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#141416', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#bfdbfe' }}
                    />
                    <Bar dataKey="total" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'details' && (
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black text-blue-50">Detalhamento de Materiais e Serviços</h3>
            <button 
              onClick={handleExportCSV}
              className="text-blue-400 text-sm font-bold flex items-center gap-2 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/50 text-blue-400/70 text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-5">Item / Material</th>
                  <th className="px-6 py-5">Categoria</th>
                  <th className="px-6 py-5">Qtd</th>
                  <th className="px-6 py-5">Unid</th>
                  <th className="px-6 py-5">Material</th>
                  <th className="px-6 py-5">Mão de Obra</th>
                  <th className="px-6 py-5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.materials.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-bold text-blue-100 group-hover:text-blue-50">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-100">{formatNumber(item.quantity)}</td>
                    <td className="px-6 py-4 text-blue-300/50">{item.unit}</td>
                    <td className="px-6 py-4 text-blue-300/50">{item.materialPrice > 0 ? formatCurrency(item.materialPrice) : '-'}</td>
                    <td className="px-6 py-4 text-blue-400/70">{item.laborPrice > 0 ? formatCurrency(item.laborPrice) : '-'}</td>
                    <td className="px-6 py-4 font-black text-blue-100">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-950/50 font-black">
                <tr className="border-t border-white/10">
                  <td colSpan={4} className="px-6 py-4 text-right text-blue-400/70 uppercase tracking-widest text-[10px]">Subtotais:</td>
                  <td className="px-6 py-4 text-blue-100">{formatCurrency(result.totalMaterialCost)}</td>
                  <td className="px-6 py-4 text-blue-400">{formatCurrency(result.totalLaborCost)}</td>
                  <td className="px-6 py-4 text-blue-50">{formatCurrency(result.totalCost)}</td>
                </tr>
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-right text-blue-400/70 uppercase tracking-widest text-xs">VALOR TOTAL DA OBRA:</td>
                  <td className="px-6 py-6 text-2xl text-blue-400">{formatCurrency(result.totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'proposal' && (
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Action Bar for Proposal */}
          <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 sticky top-24 z-40 shadow-2xl no-print">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-blue-400/50 tracking-widest">Visualização</p>
                <p className="text-sm font-bold text-blue-50">Documento Técnico Final</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-xl hover:bg-blue-600/30 transition-all text-blue-400 border border-blue-500/30 text-xs font-bold"
                title="Baixar como PDF"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button 
                onClick={handleDownloadTXT}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all text-blue-100 border border-white/5 text-xs font-bold"
                title="Baixar como Texto"
              >
                <FileText className="w-4 h-4" />
                TXT
              </button>
              <button 
                onClick={handleCopyProposal}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-blue-400 border border-white/5 text-xs font-bold"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </button>
              <button 
                onClick={handleSendWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all text-xs font-bold shadow-lg shadow-green-600/20"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>

          <div className="print-container">
            <ProposalDocument result={result} />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12 no-print">
            <button 
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto bg-zinc-900/50 text-blue-100 border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <Download className="w-6 h-6" />
              Baixar PDF
            </button>
            <button 
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto bg-blue-600 text-blue-50 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-6 h-6" />
              Enviar para o Cliente
            </button>
            <button 
              onClick={handleShare}
              className="w-full sm:w-auto bg-zinc-900/50 text-blue-100 border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <Share2 className="w-6 h-6" />
              Compartilhar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
