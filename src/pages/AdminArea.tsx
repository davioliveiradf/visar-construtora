import React, { useState, useEffect } from 'react';
import { Lock, Settings, Save, ArrowLeft, Eye, EyeOff, DollarSign, History, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { PRICES } from '../data/sinapi';

interface AdminAreaProps {
  onBack: () => void;
  onViewHistory: () => void;
}

export function AdminArea({ onBack, onViewHistory }: AdminAreaProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [laborM2, setLaborM2] = useState(PRICES.labor_m2.toString());
  const [hideM2, setHideM2] = useState(localStorage.getItem('admin_hide_m2') === 'true');
  const [customImage, setCustomImage] = useState(localStorage.getItem('admin_custom_image') || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedLabor = localStorage.getItem('admin_labor_m2');
    if (savedLabor) setLaborM2(savedLabor);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'DrrE010203') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleSave = () => {
    localStorage.setItem('admin_labor_m2', laborM2);
    localStorage.setItem('admin_hide_m2', hideM2.toString());
    if (customImage) {
      localStorage.setItem('admin_custom_image', customImage);
    } else {
      localStorage.removeItem('admin_custom_image');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for localStorage safety
      setError('A imagem é muito grande. Use uma imagem menor que 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImage(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCustomImage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-black text-blue-50 uppercase tracking-tighter">Área Administrativa</h2>
            <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest">Acesso Restrito</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest ml-4">Senha de Acesso</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-6 py-4 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                placeholder="••••••••"
                autoFocus
              />
              {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest ml-4">{error}</p>}
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={onBack}
                className="flex-1 bg-zinc-800 text-blue-100 py-4 rounded-2xl font-black text-sm hover:bg-zinc-700 transition-all uppercase tracking-widest"
              >
                Voltar
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-blue-600 text-blue-50 py-4 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-300/70 hover:text-blue-100 transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair do Painel
        </button>
        <div className="flex items-center gap-2 text-blue-400">
          <Settings className="w-5 h-5" />
          <span className="font-black uppercase tracking-tighter">Configurações do Sistema</span>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-12">
        {/* Labor Cost Setting */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-blue-50 uppercase tracking-tighter">Custo de Mão de Obra</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest ml-4">Valor Base por m² (R$)</label>
            <div className="relative">
              <input 
                type="number"
                value={laborM2}
                onChange={(e) => setLaborM2(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-6 py-4 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-black text-2xl"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400/30 font-black">BRL</span>
            </div>
            <p className="text-[10px] text-blue-400/30 font-bold uppercase tracking-widest ml-4">
              Padrão de Referência: R$ {PRICES.labor_m2.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Visibility Setting */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              {hideM2 ? <EyeOff className="w-5 h-5 text-purple-400" /> : <Eye className="w-5 h-5 text-purple-400" />}
            </div>
            <h3 className="text-xl font-black text-blue-50 uppercase tracking-tighter">Visibilidade do Cliente</h3>
          </div>

          <button 
            onClick={() => setHideM2(!hideM2)}
            className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${hideM2 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-zinc-950/50 border-white/5'}`}
          >
            <div className="text-left">
              <p className="font-black text-blue-50 uppercase tracking-tight">Ocultar Custo por m²</p>
              <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest">Esconde o valor do m² na proposta final</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all ${hideM2 ? 'bg-purple-500' : 'bg-zinc-800'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hideM2 ? 'left-7' : 'left-1'}`} />
            </div>
          </button>
        </div>

        {/* Custom Image Setting */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <ImageIcon className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-xl font-black text-blue-50 uppercase tracking-tighter">Imagem do Orçamento</h3>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest ml-4">
              Esta imagem aparecerá em todos os orçamentos (substitui a imagem da IA)
            </p>
            
            {customImage ? (
              <div className="relative group rounded-3xl overflow-hidden border border-white/10 aspect-video bg-zinc-950/50">
                <img src={customImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={handleRemoveImage}
                    className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-500 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-white/10 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                <div className="bg-blue-500/20 p-4 rounded-2xl group-hover:scale-110 transition-all">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-black text-blue-50 uppercase tracking-tight">Adicionar Foto</p>
                  <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest mt-1">PNG, JPG ou WEBP (Máx. 1MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* History Access */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-blue-50 uppercase tracking-tighter">Gestão de Orçamentos</h3>
          </div>
          
          <button 
            onClick={onViewHistory}
            className="w-full bg-zinc-950/50 border border-white/5 p-6 rounded-3xl hover:bg-zinc-800 transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <p className="font-black text-blue-50 uppercase tracking-tight group-hover:text-blue-400 transition-colors">Histórico de Orçamentos</p>
              <p className="text-xs font-bold text-blue-400/50 uppercase tracking-widest">Visualizar e gerenciar orçamentos salvos</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl group-hover:scale-110 transition-all">
              <History className="w-6 h-6 text-emerald-400" />
            </div>
          </button>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 text-blue-50 py-6 rounded-3xl font-black text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        >
          {saved ? <CheckCircle className="w-6 h-6" /> : <Save className="w-6 h-6" />}
          {saved ? 'Configurações Salvas!' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
