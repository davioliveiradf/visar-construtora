import React, { useState } from 'react';
import { BudgetInput, StandardType, FoundationType, WallType, RoofType, FinishType, DoorType, WindowType } from '../types';
import { Calculator, ChevronRight, AlertCircle } from 'lucide-react';

interface BudgetFormProps {
  onSubmit: (data: BudgetInput) => void;
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const [formData, setFormData] = useState<Partial<BudgetInput>>({
    clientName: '',
    area: 50,
    city: '',
    state: '',
    standard: 'medio',
    foundation: 'radier',
    wall: 'alvenaria',
    roof: 'ceramica',
    roofStructure: 'madeira',
    finish: 'medio',
    floor: 'Porcelanato',
    door: 'madeira',
    window: 'aluminio',
    bedrooms: 2,
    suites: 0,
    bathrooms: 1,
    kitchens: 1,
    serviceAreas: 1,
    halls: 0,
    internalPaintFinish: 'fosca',
    externalPaintFinish: 'fosca',
    wallPaintColor: 'Branco Neve',
    ceilingPaintColor: 'Branco Gelo',
    externalPaintColor: 'Cinza Platina',
    externalPaintBrand: 'Suvinil',
    externalCoating: 'pintura',
    countertopType: 'Cozinha e Banheiro',
    countertopStone: 'granito',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.area || !formData.city || !formData.state) {
      setError('Por favor, preencha todos os campos obrigatórios (Nome, Área, Cidade e Estado).');
      return;
    }
    
    // Updated limit to be more flexible for a construction company
    if (formData.area > 500) {
      setError('Para áreas acima de 500 m², entre em contato direto com a engenharia da Visar Construtora.');
      return;
    }

    onSubmit({
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as BudgetInput);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-blue-50">Configurar Novo Orçamento</h2>
        <p className="text-blue-300/70 font-medium">Detalhamento completo para Visar Construtora.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Nome do Cliente *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Área Total (m²) *</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              max="500"
              min="10"
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Padrão</label>
            <select name="standard" value={formData.standard} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Cidade *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Estado *</label>
            <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option value="">Selecione...</option>
              {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            Composição de Cômodos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Quartos', name: 'bedrooms' },
              { label: 'Suítes', name: 'suites' },
              { label: 'Banheiros', name: 'bathrooms' },
              { label: 'Cozinhas', name: 'kitchens' },
              { label: 'Área Serv.', name: 'serviceAreas' },
              { label: 'Hall/Corr.', name: 'halls' },
            ].map(room => (
              <div key={room.name} className="space-y-1">
                <label className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest">{room.label}</label>
                <input
                  type="number"
                  name={room.name}
                  value={formData[room.name as keyof BudgetInput] as number}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            Estrutura e Cobertura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Fundação</label>
              <select name="foundation" value={formData.foundation} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="radier">Radier</option>
                <option value="sapata">Sapata</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Paredes</label>
              <select name="wall" value={formData.wall} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="alvenaria">Alvenaria</option>
                <option value="eps">EPS</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Tipo de Telha</label>
              <select name="roof" value={formData.roof} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="ceramica">Cerâmica</option>
                <option value="metalica">Metálica</option>
                <option value="fibrocimento">Fibrocimento</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Estrutura Telhado</label>
              <select name="roofStructure" value={formData.roofStructure} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="madeira">Madeira</option>
                <option value="metalica">Metálica</option>
                <option value="perfil_aco">Perfil de Aço</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            Pintura e Revestimento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Acabamento Interno</label>
              <select name="internalPaintFinish" value={formData.internalPaintFinish} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="fosca">Fosca</option>
                <option value="acetinada">Acetinada</option>
                <option value="semi-brilho">Semi-Brilho</option>
                <option value="brilhante">Brilhante</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Cor das Paredes</label>
              <input type="text" name="wallPaintColor" value={formData.wallPaintColor} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Cor do Teto</label>
              <input type="text" name="ceilingPaintColor" value={formData.ceilingPaintColor} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Revestimento Externo</label>
              <select name="externalCoating" value={formData.externalCoating} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="pintura">Pintura Comum</option>
                <option value="textura">Textura Rolo</option>
                <option value="grafiato">Grafiato</option>
                <option value="projetada">Pintura Projetada</option>
                <option value="fuge_pedrisco">Fuge com Pedrisco Natural</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Marca da Tinta (Externa)</label>
              <input type="text" name="externalPaintBrand" value={formData.externalPaintBrand} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Suvinil, Coral..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Cor Externa</label>
              <input type="text" name="externalPaintColor" value={formData.externalPaintColor} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Cinza Urbano" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            Bancadas e Pedras
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Tipo de Piso</label>
              <input type="text" name="floor" value={formData.floor} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Porcelanato, Cerâmica..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Tipo de Bancada</label>
              <input type="text" name="countertopType" value={formData.countertopType} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400/70 uppercase tracking-widest">Tipo de Pedra</label>
              <select name="countertopStone" value={formData.countertopStone} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-blue-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="granito">Granito</option>
                <option value="marmore">Mármore</option>
                <option value="quartzo">Quartzo</option>
                <option value="inox">Inox</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-blue-50 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <Calculator className="w-7 h-7" />
          GERAR ORÇAMENTO VISAR CONSTRUTORA
          <ChevronRight className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
