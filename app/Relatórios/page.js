"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { MessageCircle, Pencil, Save } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

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
