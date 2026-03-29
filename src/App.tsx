import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BudgetForm } from './pages/NewBudget';
import { BudgetResultView } from './pages/BudgetResultView';
import { HistoryList } from './pages/HistoryList';
import { AdminArea } from './pages/AdminArea';
import { BudgetInput, BudgetResult } from './types';
import { calculateBudget, saveBudget, updateBudget, getHistory, generateHouseImage } from './services/budgetService';
import { Loader2 } from 'lucide-react';

type View = 'home' | 'new' | 'result' | 'history' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [currentBudget, setCurrentBudget] = useState<BudgetResult | null>(null);
  const [history, setHistory] = useState<BudgetResult[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    window.scrollTo(0, 0);

    const handleOpenAdmin = () => setView('admin');
    window.addEventListener('open-admin', handleOpenAdmin);
    return () => window.removeEventListener('open-admin', handleOpenAdmin);
  }, [view]);

  const handleCreateBudget = async (input: BudgetInput) => {
    // 1. Calculate budget immediately
    const result = calculateBudget(input);
    setCurrentBudget(result);
    saveBudget(result); // Save immediately so it's in history
    setHistory(getHistory());
    setView('result');
    
    // 2. Start image generation in background
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateHouseImage(input);
      if (imageUrl) {
        const finalResult = { ...result, imageUrl };
        setCurrentBudget(finalResult);
        updateBudget(finalResult); // Update the existing record
        setHistory(getHistory());
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSelectHistory = (budget: BudgetResult) => {
    setCurrentBudget(budget);
    setView('result');
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(b => b.input.id !== id);
    localStorage.setItem('budget_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onNewBudget={() => setView('new')} onViewHistory={() => setView('history')} />;
      case 'new':
        return <BudgetForm onSubmit={handleCreateBudget} />;
      case 'result':
        return currentBudget ? (
          <BudgetResultView 
            result={currentBudget} 
            onBack={() => setView('history')} 
            isGeneratingImage={isGeneratingImage}
          />
        ) : <Home onNewBudget={() => setView('new')} onViewHistory={() => setView('history')} />;
      case 'history':
        return (
          <HistoryList 
            history={history} 
            onSelect={handleSelectHistory} 
            onDelete={handleDeleteHistory}
          />
        );
      case 'admin':
        return <AdminArea onBack={() => setView('home')} onViewHistory={() => setView('history')} />;
      default:
        return <Home onNewBudget={() => setView('new')} onViewHistory={() => setView('history')} />;
    }
  };

  const getActiveTab = (): 'home' | 'new' => {
    if (view === 'new') return 'new';
    return 'home';
  };

  return (
    <Layout view={view} activeTab={getActiveTab()} onTabChange={(tab) => setView(tab as View)} onAdmin={() => setView('admin')}>
      {renderView()}
    </Layout>
  );
}
