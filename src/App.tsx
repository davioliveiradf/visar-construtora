import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BudgetForm } from './pages/NewBudget';
import { BudgetResultView } from './pages/BudgetResultView';
import { HistoryList } from './pages/HistoryList';
import { BudgetInput, BudgetResult } from './types';
import { calculateBudget, saveBudget, getHistory } from './services/budgetService';

type View = 'home' | 'new' | 'result' | 'history';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [currentBudget, setCurrentBudget] = useState<BudgetResult | null>(null);
  const [history, setHistory] = useState<BudgetResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, [view]);

  const handleCreateBudget = (input: BudgetInput) => {
    const result = calculateBudget(input);
    saveBudget(result);
    setCurrentBudget(result);
    setView('result');
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
      default:
        return <Home onNewBudget={() => setView('new')} onViewHistory={() => setView('history')} />;
    }
  };

  const getActiveTab = (): 'home' | 'new' | 'history' => {
    if (view === 'result') return 'history';
    return view as 'home' | 'new' | 'history';
  };

  return (
    <Layout activeTab={getActiveTab()} onTabChange={(tab) => setView(tab)}>
      {renderView()}
    </Layout>
  );
}
