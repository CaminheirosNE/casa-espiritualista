import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Check, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const FinancialControl = () => {
  // Estado para controlar mensalidades dos trabalhadores
  const [workers, setWorkers] = useState([]);
  const [monthlyFee, setMonthlyFee] = useState("50.00"); // Valor padrão da mensalidade
  const [isEditingFee, setIsEditingFee] = useState(false);

  // Estado para despesas e entradas
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', value: '' });
  const [newIncome, setNewIncome] = useState({ description: '', value: '' });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  // Simulação de dados de trabalhadores
  useEffect(() => {
    setWorkers([
      { 
        codigo: 'CM0001', 
        nome: 'João Silva',
        mensalidade: {
          valor: 50.00,
          status: 'PENDENTE',
          ultimoPagamento: null
        }
      },
      { 
        codigo: 'CM0002', 
        nome: 'Maria Santos',
        mensalidade: {
          valor: 50.00,
          status: 'PAGO',
          ultimoPagamento: '2025-01-10'
        }
      }
    ]);
  }, []);

  // Função para calcular totais
  const calculateTotals = () => {
    const totalMonthlyFeesExpected = workers.length * parseFloat(monthlyFee);
    const totalMonthlyFeesPaid = workers.reduce((acc, worker) => 
      acc + (worker.mensalidade.status === 'PAGO' ? parseFloat(monthlyFee) : 0), 0
    );
    const totalExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.value), 0);
    const totalIncomes = incomes.reduce((acc, inc) => acc + parseFloat(inc.value), 0);
    const totalBalance = totalMonthlyFeesPaid + totalIncomes - totalExpenses;

    return {
      expectedFees: totalMonthlyFeesExpected,
      paidFees: totalMonthlyFeesPaid,
      expenses: totalExpenses,
      incomes: totalIncomes,
      balance: totalBalance
    };
  };

  // Função para alternar status de pagamento
  const togglePaymentStatus = (workerCode) => {
    setWorkers(workers.map(worker => {
      if (worker.codigo === workerCode) {
        const newStatus = worker.mensalidade.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
        return {
          ...worker,
          mensalidade: {
            ...worker.mensalidade,
            status: newStatus,
            ultimoPagamento: newStatus === 'PAGO' ? new Date().toISOString().split('T')[0] : null
          }
        };
      }
      return worker;
    }));
  };

  // Funções para adicionar despesas e entradas
  const handleAddExpense = () => {
    if (newExpense.description && newExpense.value) {
      setExpenses([...expenses, {
        id: Date.now(),
        ...newExpense,
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewExpense({ description: '', value: '' });
      setShowExpenseForm(false);
    }
  };

  const handleAddIncome = () => {
    if (newIncome.description && newIncome.value) {
      setIncomes([...incomes, {
        id: Date.now(),
        ...newIncome,
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewIncome({ description: '', value: '' });
      setShowIncomeForm(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Controle Financeiro</h2>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar
          </Button>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-green-50">
            <h3 className="text-sm font-medium text-green-800 mb-2">Saldo Total</h3>
            <p className="text-2xl font-bold text-green-700">
              R$ {totals.balance.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Mensalidades</h3>
            <p className="text-2xl font-bold text-blue-700">
              R$ {totals.paidFees.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4 bg-yellow-50">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Entradas</h3>
            <p className="text-2xl font-bold text-yellow-700">
              R$ {totals.incomes.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4 bg-red-50">
            <h3 className="text-sm font-medium text-red-800 mb-2">Despesas</h3>
            <p className="text-2xl font-bold text-red-700">
              R$ {totals.expenses.toFixed(2)}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mensalidades */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Mensalidades</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Valor: R$</span>
                {isEditingFee ? (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={monthlyFee}
                      onChange={(e) => setMonthlyFee(e.target.value)}
                      className="w-24"
                      step="0.01"
                    />
                    <Button
                      size="sm"
                      onClick={() => setIsEditingFee(false)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingFee(true)}
                  >
                    {monthlyFee}
                  </Button>
                )}
              </div>
            </div>

            {workers.map((worker) => (
              <div 
                key={worker.codigo}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2"
              >
                <div>
                  <p className="font-medium">{worker.nome}</p>
                  <p className="text-sm text-gray-600">{worker.codigo}</p>
                </div>
                <Button
                  variant={worker.mensalidade.status === 'PAGO' ? 'default' : 'outline'}
                  onClick={() => togglePaymentStatus(worker.codigo)}
                  className={worker.mensalidade.status === 'PAGO' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'text-gray-600 hover:text-gray-700'}
                >
                  {worker.mensalidade.status === 'PAGO' ? 'Pago' : 'Pendente'}
                </Button>
              </div>
            ))}
          </Card>

          {/* Despesas e Entradas */}
          <div className="space-y-6">
            {/* Entradas */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Entradas</h3>
                <Button
                  onClick={() => setShowIncomeForm(!showIncomeForm)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Entrada
                </Button>
              </div>

              {showIncomeForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <Input
                      placeholder="Descrição da entrada"
                      value={newIncome.description}
                      onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={newIncome.value}
                      onChange={(e) => setNewIncome({ ...newIncome, value: e.target.value })}
                      step="0.01"
                    />
                    <div className="flex justify-end gap-2">
                      <Button onClick={handleAddIncome}>Adicionar</Button>
                    </div>
                  </div>
                </div>
              )}

              {incomes.map((income) => (
                <div 
                  key={income.id}
                  className="p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="font-medium text-green-600">
                      R$ {parseFloat(income.value).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Despesas */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Despesas</h3>
                <Button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Despesa
                </Button>
              </div>

              {showExpenseForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <Input
                      placeholder="Descrição da despesa"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={newExpense.value}
                      onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })}
                      step="0.01"
                    />
                    <div className="flex justify-end gap-2">
                      <Button onClick={handleAddExpense}>Adicionar</Button>
                    </div>
                  </div>
                </div>
              )}

              {expenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="font-medium text-red-600">
                      R$ {parseFloat(expense.value).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialControl;