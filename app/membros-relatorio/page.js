"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle } from "lucide-react";

const MemberReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'codigo', direction: 'asc' });
  const [members, setMembers] = useState([
    { 
      codigo: 'CM0001', 
      nome: 'João Silva', 
      tipo: 'T', // T para Trabalhador, C para Consulente
      sexo: 'M', 
      dataNascimento: '1990-05-15', 
      telefone: '(11) 98765-4321' 
    },
    { 
      codigo: 'CM0002', 
      nome: 'Maria Santos', 
      tipo: 'C',
      sexo: 'F', 
      dataNascimento: '1985-08-22', 
      telefone: '(11) 91234-5678' 
    }
  ]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    
    const sortedMembers = [...members].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setMembers(sortedMembers);
  };

  const filteredMembers = members.filter(member => 
    Object.values(member).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const openWhatsApp = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${formattedPhone}`, '_blank');
  };

  const toggleMemberType = (memberId) => {
    if (window.confirm('Tem certeza que deseja alterar o tipo deste membro?')) {
      setMembers(members.map(member => 
        member.codigo === memberId 
          ? { ...member, tipo: member.tipo === 'T' ? 'C' : 'T' }
          : member
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 shadow-lg">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Relatório de Membros</h2>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-700"
            >
              Voltar
            </Button>
          </div>

          {/* Barra de pesquisa */}
          <div className="mb-6">
            <Input
              placeholder="Pesquisar por qualquer campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4 text-left cursor-pointer hover:bg-blue-100" onClick={() => handleSort('codigo')}>
                    Código {sortConfig.key === 'codigo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left cursor-pointer hover:bg-blue-100" onClick={() => handleSort('nome')}>
                    Nome {sortConfig.key === 'nome' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left">Tipo</th>
                  <th className="p-4 text-left cursor-pointer hover:bg-blue-100" onClick={() => handleSort('sexo')}>
                    Sexo {sortConfig.key === 'sexo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left cursor-pointer hover:bg-blue-100" onClick={() => handleSort('dataNascimento')}>
                    Data de Nascimento {sortConfig.key === 'dataNascimento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left">Telefone</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.codigo} className="hover:bg-blue-50">
                    <td className="p-4 border-t">{member.codigo}</td>
                    <td className="p-4 border-t">{member.nome}</td>
                    <td className="p-4 border-t">
                      <Button
                        variant="ghost"
                        onClick={() => toggleMemberType(member.codigo)}
                        className={member.tipo === 'T' ? 'text-blue-600' : 'text-gray-600'}
                      >
                        {member.tipo === 'T' ? 'Trabalhador' : 'Consulente'}
                      </Button>
                    </td>
                    <td className="p-4 border-t">{member.sexo === 'M' ? 'Masculino' : 'Feminino'}</td>
                    <td className="p-4 border-t">{formatDate(member.dataNascimento)}</td>
                    <td className="p-4 border-t">
                      <div className="flex items-center gap-2">
                        <span>{member.telefone}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openWhatsApp(member.telefone)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este membro?')) {
                            setMembers(members.filter(m => m.codigo !== member.codigo));
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total de membros encontrados: {filteredMembers.length}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberReport;