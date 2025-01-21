"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Check, DollarSign, TrendingUp, TrendingDown, Trash2, Edit } from "lucide-react";
import { useRouter } from 'next/navigation';

const FinancialControl = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  
  // Carregar dados do localStorage
  const loadFromStorage = (key, defaultValue) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    }
    return defaultValue;
  };

  // Estados com persistência
  const [workers, setWorkers] = useState(() => loadFromStorage('workers', []));
  const [monthlyFee, setMonthlyFee] = useState(() => loadFromStorage('monthlyFee', "50.00"));
  const [expenses, setExpenses] = useState(() => loadFromStorage('expenses', []));
  const [incomes, setIncomes] = useState(() => loadFromStorage('incomes', []));
  
  // Estados locais
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', value: '' });
  const [newIncome, setNewIncome] = useState({ description: '', value: '' });

  // Carregar dados iniciais (simulação)
  useEffect(() => {
    if (workers.length === 0) {
      const initialWorkers = [
        { 
          codigo: 'CM0001', 
          nome: 'João Silva',
          mensalidade: {
            valor: 50.00,
            status: 'PENDENTE',
            ultimoPagamento: null,
            historicoAlteracoes: []
          }
        },
        // ... outros trabalhadores
      ];
      setWorkers(initialWorkers);
      localStorage.setItem('workers', JSON.stringify(initialWorkers));
    }
  }, []);

  // Salvar alterações no localStorage
  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
    localStorage.setItem('monthlyFee', monthlyFee);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [workers, monthlyFee, expenses, incomes]);

  // Validação de valor numérico
  const validateAmount = (value) => {
    const amount = parseFloat(value);
    return !isNaN(amount) && amount > 0;
  };

  // Funções de manipulação de dados com validação
  const handleAddExpense = () => {
    if (!validateAmount(newExpense.value)) {
      setError('Valor da despesa inválido');
      return;
    }
    
    if (!newExpense.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    setExpenses(prev => [...prev, {
      id: Date.now(),
      ...newExpense,
      date: new Date().toISOString().split('T')[0]
    }]);
    setNewExpense({ description: '', value: '' });
    setShowExpenseForm(false);
    setError('');
  };

  // Função similar para handleAddIncome
  // ... (implementação similar à handleAddExpense)

  const handleDeleteItem = (id, type) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      if (type === 'expense') {
        setExpenses(prev => prev.filter(item => item.id !== id));
      } else {
        setIncomes(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  const togglePaymentStatus = (workerCode) => {
    setWorkers(workers.map(worker => {
      if (worker.codigo === workerCode) {
        const newStatus = worker.mensalidade.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
        const alteracao = {
          data: new Date().toISOString(),
          status: newStatus,
          valorAntigo: worker.mensalidade.valor,
          valorNovo: parseFloat(monthlyFee)
        };

        return {
          ...worker,
          mensalidade: {
            ...worker.mensalidade,
            status: newStatus,
            valor: parseFloat(monthlyFee),
            ultimoPagamento: newStatus === 'PAGO' ? new Date().toISOString() : null,
            historicoAlteracoes: [...(worker.mensalidade.historicoAlteracoes || []), alteracao]
          }
        };
      }
      return worker;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* ... (resto do JSX permanece o mesmo) ... */}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* ... (componentes existentes) ... */}
      </div>
    </div>
  );
};

export default FinancialControl;