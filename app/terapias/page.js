"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "/components/ui/card";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Search } from "lucide-react";

const TherapyScheduling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isEditingLimits, setIsEditingLimits] = useState(false);

  const [therapies, setTherapies] = useState([
    { 
      id: 1,
      name: 'Conversa Fraterna',
      room: 'Sala de Atendimento',
      dailyLimit: 20,
      currentTokens: 0,
      sequence: 0
    },
    { 
      id: 2,
      name: 'Conversa Aruandeira',
      room: 'Sala de Atendimento',
      dailyLimit: 15,
      currentTokens: 0,
      sequence: 0
    },
    { 
      id: 3,
      name: 'Passe de Macas',
      room: 'Sala de Espera',
      dailyLimit: 25,
      currentTokens: 0,
      sequence: 0
    },
    { 
      id: 4,
      name: 'Reyki',
      room: 'Sala de Espera',
      dailyLimit: 15,
      currentTokens: 0,
      sequence: 0
    },
    { 
      id: 5,
      name: 'Cirurgia Espiritual',
      room: 'Sala de Espera',
      dailyLimit: 10,
      currentTokens: 0,
      sequence: 0
    },
    { 
      id: 6,
      name: 'Limpeza Espiritual',
      room: 'Sala de Atendimento',
      dailyLimit: 20,
      currentTokens: 0,
      sequence: 0
    }
  ]);

  const mockMembers = [
    { codigo: 'CM0001', nome: 'João Silva', therapyHistory: {} },
    { codigo: 'CM0002', nome: 'Maria Santos', therapyHistory: {} }
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const results = mockMembers.filter(member => 
        member.codigo.toLowerCase().includes(value.toLowerCase()) ||
        member.nome.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectMember = (member) => {
    setSelectedMember(member);
    setSearchResults([]);
    setSearchTerm('');
  };

  const generateToken = (therapy) => {
    if (therapy.currentTokens >= therapy.dailyLimit) {
      alert('Limite de senhas excedido para esta terapia!');
      return;
    }

    const newTherapies = therapies.map(t => {
      if (t.id === therapy.id) {
        return {
          ...t,
          sequence: t.sequence + 1,
          currentTokens: t.currentTokens + 1
        };
      }
      return t;
    });

    setTherapies(newTherapies);
    alert(`Senha gerada: ${therapy.name} - ${therapy.sequence + 1}`);
  };

  const updateTherapyLimit = (therapyId, newLimit) => {
    const updatedTherapies = therapies.map(therapy => {
      if (therapy.id === therapyId) {
        return { ...therapy, dailyLimit: parseInt(newLimit) };
      }
      return therapy;
    });
    setTherapies(updatedTherapies);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Terapias</h2>
          <div className="space-x-4">
            <Button 
              variant="outline"
              onClick={() => setIsEditingLimits(!isEditingLimits)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditingLimits ? 'Salvar Limites' : 'Configurar Limites'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-700"
            >
              Voltar
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="relative">
            <div className="flex gap-4">
              <Input
                placeholder="Buscar por código ou nome do membro..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <Card className="absolute w-full mt-2 p-2 z-10 bg-white shadow-lg">
                {searchResults.map((member) => (
                  <div
                    key={member.codigo}
                    className="p-2 hover:bg-blue-50 cursor-pointer rounded"
                    onClick={() => selectMember(member)}
                  >
                    <p className="font-medium">{member.nome}</p>
                    <p className="text-sm text-gray-600">{member.codigo}</p>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </Card>

        {selectedMember && (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Membro selecionado: {selectedMember.nome} ({selectedMember.codigo})
              </AlertDescription>
            </Alert>

            {therapies.map((therapy) => (
              <Card key={therapy.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{therapy.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <span className="font-medium">Senhas hoje:</span>
                        <span className="ml-2">{therapy.currentTokens}/{therapy.dailyLimit}</span>
                      </span>
                      <span className="flex items-center">
                        <span className="font-medium">Local:</span>
                        <span className="ml-2">{therapy.room}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEditingLimits ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={therapy.dailyLimit}
                          onChange={(e) => updateTherapyLimit(therapy.id, e.target.value)}
                          className="w-20"
                          min="1"
                        />
                      </div>
                    ) : (
                      <Button
                        onClick={() => generateToken(therapy)}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={therapy.currentTokens >= therapy.dailyLimit}
                      >
                        Gerar Senha
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyScheduling;
