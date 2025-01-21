"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Printer, ArrowLeft } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Funções auxiliares
const calculateTotalIncome = (data) => {
  const monthlyFees = (data.monthlyFees?.paid || 0) * (data.monthlyFee || 50);
  const otherIncomes = (data.incomes || []).reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
  return monthlyFees + otherIncomes;
};

const calculateTotalExpenses = (data) => {
  return (data.expenses || []).reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
};

const processMembersData = (members) => {
  const now = new Date();
  return {
    total: members.length,
    new: members.filter(m => {
      const createDate = new Date(m.dataCadastro);
      return createDate.getMonth() === now.getMonth() && 
             createDate.getFullYear() === now.getFullYear();
    }).length,
    types: {
      consultants: members.filter(m => m.tipo === 'consulente').length,
      workers: members.filter(m => m.tipo === 'trabalhador').length
    },
    gender: {
      male: members.filter(m => m.sexo === 'M').length,
      female: members.filter(m => m.sexo === 'F').length
    },
    ageGroups: processAgeGroups(members)
  };
};

const processAgeGroups = (members) => {
  const ageGroups = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-55": 0,
    "56+": 0
  };

  members.forEach(member => {
    const age = calculateAge(member.dataNascimento);
    if (age <= 25) ageGroups["18-25"]++;
    else if (age <= 35) ageGroups["26-35"]++;
    else if (age <= 45) ageGroups["36-45"]++;
    else if (age <= 55) ageGroups["46-55"]++;
    else ageGroups["56+"]++;
  });

  return Object.entries(ageGroups).map(([range, count]) => ({ range, count }));
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const Reports = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Carregar dados do localStorage
        const financialData = JSON.parse(localStorage.getItem('financialData') || '{}');
        const membersData = JSON.parse(localStorage.getItem('members') || '[]');
        
        // Filtrar dados pelo período selecionado
        const filteredData = filterDataByDateRange(financialData, membersData, dateRange);
        
        setReportData({
          financial: {
            income: calculateTotalIncome(filteredData),
            expenses: calculateTotalExpenses(filteredData),
            monthlyFees: filteredData.monthlyFees || { paid: 0, pending: 0 }
          },
          members: processMembersData(membersData)
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dateRange]);

  const handleDateChange = (key, value) => {
    const newRange = { ...dateRange, [key]: value };
    
    if (new Date(newRange.start) > new Date(newRange.end)) {
      setError('Data inicial não pode ser maior que a data final');
      return;
    }

    setError('');
    setDateRange(newRange);
  };

  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      const XLSX = await import('xlsx');
      
      // Preparar dados para exportação
      const financialSheet = [
        {
          'Período': `${dateRange.start} a ${dateRange.end}`,
          'Entradas': reportData.financial.income,
          'Saídas': reportData.financial.expenses,
          'Saldo': reportData.financial.income - reportData.financial.expenses
        }
      ];

      const membersSheet = [
        {
          'Total de Membros': reportData.members.total,
          'Novos Cadastros': reportData.members.new,
          'Consulentes': reportData.members.types.consultants,
          'Trabalhadores': reportData.members.types.workers,
          'Masculino': reportData.members.gender.male,
          'Feminino': reportData.members.gender.female
        }
      ];

      // Criar workbook
      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(financialSheet);
      const ws2 = XLSX.utils.json_to_sheet(membersSheet);
      
      XLSX.utils.book_append_sheet(wb, ws1, "Financeiro");
      XLSX.utils.book_append_sheet(wb, ws2, "Membros");
      
      // Salvar arquivo
      XLSX.writeFile(wb, `relatorio_${dateRange.start}_${dateRange.end}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setError('Erro ao exportar para Excel');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <style>
        @media print {
          .no-print { display: none; }
          .page-break { page-break-before: always; }
          body { font-family: Arial, sans-serif; }
          .chart { height: 300px; margin: 20px 0; }
        }
      </style>
      <div class="print-content">
        <h1>Relatório - ${dateRange.start} a ${dateRange.end}</h1>
        
        <div class="page-break">
          <h2>Resumo Financeiro</h2>
          <p>Entradas: R$ ${reportData?.financial.income.toFixed(2)}</p>
          <p>Saídas: R$ ${reportData?.financial.expenses.toFixed(2)}</p>
          <p>Saldo: R$ ${(reportData?.financial.income - reportData?.financial.expenses).toFixed(2)}</p>
        </div>
        
        <div class="page-break">
          <h2>Dados de Membros</h2>
          <p>Total de Membros: ${reportData?.members.total}</p>
          <p>Novos Cadastros: ${reportData?.members.new}</p>
          <p>Consulentes: ${reportData?.members.types.consultants}</p>
          <p>Trabalhadores: ${reportData?.members.types.workers}</p>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Relatórios</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="text-green-600 hover:text-green-700"
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="text-blue-600 hover:text-blue-700"
              disabled={isLoading}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Financial Summary */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Entradas</p>
              <p className="text-xl font-bold text-green-600">
                R$ {reportData?.financial.income.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saídas</p>
              <p className="text-xl font-bold text-red-600">
                R$ {reportData?.financial.expenses.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saldo</p>
              <p className="text-xl font-bold text-blue-600">
                R$ {(reportData?.financial.income - reportData?.financial.expenses).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Entradas', valor: reportData?.financial.income },
                  { name: 'Saídas', valor: reportData?.financial.expenses }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Bar 
                  dataKey="valor" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Member Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status de Membros</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total de Membros:</span>
                <span className="font-bold">{reportData?.members.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Novos Cadastros:</span>
                <span className="font-bold">{reportData?.members.new}</span>
              </div>
              <div className="flex justify-between">
                <span>Consulentes:</span>
                <span className="font-bold">{reportData?.members.types.consultants}</span>
              </div>
              <div className="flex justify-between">
                <span>Trabalhadores:</span>
                <span className="font-bold">{reportData?.members.types.workers}</span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Consulentes',
                    data={[
                      { name: 'Consulentes', value: reportData?.members.types.consultants },
                      { name: 'Trabalhadores', value: reportData?.members.types.workers }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Sexo</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Masculino:</span>
                <span className="font-bold">{reportData?.members.gender.male}</span>
              </div>
              <div className="flex justify-between">
                <span>Feminino:</span>
                <span className="font-bold">{reportData?.members.gender.female}</span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Masculino', value: reportData?.members.gender.male },
                      { name: 'Feminino', value: reportData?.members.gender.female }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#2196F3" />
                    <Cell fill="#E91E63" />
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Age Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Faixa Etária</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData?.members.ageGroups}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Quantidade" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Função auxiliar para filtrar dados por período
const filterDataByDateRange = (financialData, membersData, dateRange) => {
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  
  return {
    ...financialData,
    expenses: (financialData.expenses || []).filter(expense => {
      const date = new Date(expense.date);
      return date >= start && date <= end;
    }),
    incomes: (financialData.incomes || []).filter(income => {
      const date = new Date(income.date);
      return date >= start && date <= end;
    })
  };
};

export default Reports;