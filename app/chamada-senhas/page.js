"use client";

import React, { useState } from 'react';
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';

const TokenDisplay = () => {
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [currentTokens, setCurrentTokens] = useState([]);
  const [nextToken, setNextToken] = useState(null);

  const commonMessage = `
    Pedimos a gentileza de não entrar nas terapias portando chaves, óculos, carteira e celular.
    Se estiver utilizando cinto, abrir ou retirar. Retirar os calçados.
  `;

  const therapies = [
    {
      id: 1,
      name: 'Conversa Fraterna',
      room: 'Sala de Atendimento',
      callSize: 1,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Conversa Aruandeira',
      room: 'Sala de Atendimento',
      callSize: 1,
      color: 'bg-blue-700'
    },
    {
      id: 3,
      name: 'Passe de Macas',
      room: 'Sala de Espera',
      callSize: 3,
      color: 'bg-blue-800'
    },
    {
      id: 4,
      name: 'Reyki',
      room: 'Sala de Espera',
      callSize: 2,
      color: 'bg-blue-600'
    },
    {
      id: 5,
      name: 'Cirurgia Espiritual',
      room: 'Sala de Espera',
      callSize: 2,
      color: 'bg-blue-700'
    },
    {
      id: 6,
      name: 'Limpeza Espiritual',
      room: 'Sala de Atendimento',
      callSize: 1,
      color: 'bg-blue-800'
    }
  ];

  // Dados simulados de senhas
  const mockTokens = {
    1: [
      { code: 'CF001', name: 'João Silva' },
      { code: 'CF002', name: 'Maria Santos' },
      { code: 'CF003', name: 'Pedro Oliveira' }
    ],
    2: [
      { code: 'CA001', name: 'Ana Souza' },
      { code: 'CA002', name: 'Carlos Lima' }
    ]
  };

  const handleSelectTherapy = (therapy) => {
    setSelectedTherapy(therapy);
    const tokens = mockTokens[therapy.id] || [];
    const initial = tokens.slice(0, therapy.callSize);
    const next = tokens[therapy.callSize];
    setCurrentTokens(initial);
    setNextToken(next);
  };

  const handleNextToken = () => {
    if (nextToken) {
      setCurrentTokens(prev => [...prev.slice(1), nextToken]);
      const tokens = mockTokens[selectedTherapy.id] || [];
      const nextIndex = tokens.findIndex(t => t.code === nextToken.code) + 1;
      setNextToken(tokens[nextIndex] || null);
    }
  };

  if (!selectedTherapy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Chamada de Senhas</h2>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-700"
            >
              Voltar
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {therapies.map((therapy) => (
              <Card 
                key={therapy.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => handleSelectTherapy(therapy)}
                  className={`w-full h-32 text-2xl font-semibold text-white 
                           ${therapy.color} hover:brightness-110
                           transition-all duration-300`}
                >
                  {therapy.name}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Button 
            variant="outline"
            onClick={() => setSelectedTherapy(null)}
            className="absolute top-4 left-4 text-white border-white hover:bg-blue-700"
          >
            Voltar
          </Button>
          <h1 className="text-5xl font-bold text-white mb-4">
            {selectedTherapy.name}
          </h1>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200 mb-8">
          <AlertDescription className="text-center text-xl font-medium text-yellow-800">
            {commonMessage}
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {currentTokens.map((token, index) => (
            <Card 
              key={index}
              className={`p-8 bg-white ${index === 0 ? 'border-4 border-green-500' : ''}`}
            >
              <div className="text-center">
                <h3 className="text-4xl font-bold text-blue-900 mb-4">
                  {token.code} - {token.name}
                </h3>
                <p className="text-2xl text-gray-600">
                  Local: {selectedTherapy.room}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {nextToken && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              Próxima Senha:
            </h3>
            <Card className="p-6 bg-gray-100">
              <div className="text-center">
                <p className="text-2xl text-gray-600">
                  {nextToken.code} - {nextToken.name}
                </p>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={handleNextToken}
            disabled={!nextToken}
            className="bg-green-600 hover:bg-green-700 text-white text-2xl py-8 px-12"
          >
            Chamar Próxima Senha
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;
