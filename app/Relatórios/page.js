"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Printer } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  // Dados simulados
  const data = {
    financial: {
      income: 5000,
      expenses: 3000,
      monthlyFees: {
        paid: 10,
        pending: 5
      }
    },
    members: {
      total: 150,
      new: 5,
      types: {
        consultants: 100,
        workers: 50
      },
      gender: {
        male: 60,
        female: 90
      },
      ageGroups: [
        { range: "18-25", count: 20 },
        { range: "26-35", count: 45 },
        { range: "36-45", count: 35 },
        { range: "46-55", count: 30 },
        { range: "56+", count: 20 }
      ]
    }
  };

  // Funções de exportação e impressão
  const handleExportExcel = () => {
    // Em produção, isso será conectado ao SheetJS
    console.log("Exportando para Excel...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Relatórios</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="text-green-600 hover:text-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="text-blue-600 hover:text-blue-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="text-blue-600 hover:text-blue-700"
            >
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
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
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
                R$ {data.financial.income.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saídas</p>
              <p className="text-xl font-bold text-red-600">
                R$ {data.financial.expenses.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saldo</p>
              <p className="text-xl font-bold text-blue-600">
                R$ {(data.financial.income - data.financial.expenses).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Entradas', valor: data.financial.income },
                  { name: 'Saídas', valor: data.financial.expenses }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Member Statistics */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status de Membros</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total de Membros:</span>
                <span className="font-bold">{data.members.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Novos Cadastros:</span>
                <span className="font-bold">{data.members.new}</span>
              </div>
              <div className="flex justify-between">
                <span>Consulentes:</span>
                <span className="font-bold">{data.members.types.consultants}</span>
              </div>
              <div className="flex justify-between">
                <span>Trabalhadores:</span>
                <span className="font-bold">{data.members.types.workers}</span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Consulentes', value: data.members.types.consultants },
                      { name: 'Trabalhadores', value: data.members.types.workers }
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
                  <Tooltip />
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
                <span className="font-bold">{data.members.gender.male}</span>
              </div>
              <div className="flex justify-between">
                <span>Feminino:</span>
                <span className="font-bold">{data.members.gender.female}</span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Masculino', value: data.members.gender.male },
                      { name: 'Feminino', value: data.members.gender.female }
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
                  <Tooltip />
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
                data={data.members.ageGroups}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Quantidade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;