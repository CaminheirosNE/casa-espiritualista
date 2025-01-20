import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, CheckCircle, Plus, Calendar, Trash2 } from "lucide-react";

const AttendanceControl = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ nome: '', data: '' });
  
  // Estado para eventos
  const [eventos, setEventos] = useState([
    { id: 1, nome: 'Palestra Especial', data: '2024-01-15' },
    { id: 2, nome: 'Curso de Desenvolvimento', data: '2024-01-20' },
    { id: 3, nome: 'Reunião Mensal', data: '2024-02-01' }
  ]);

  // Simulação de dados de trabalhadores
  const mockWorkers = [
    { codigo: 'CM0001', nome: 'João Silva' },
    { codigo: 'CM0002', nome: 'Maria Santos' }
  ];

  const handleAddEvent = () => {
    if (newEvent.nome && newEvent.data) {
      setEventos([
        ...eventos,
        {
          id: Date.now(),
          ...newEvent
        }
      ]);
      setNewEvent({ nome: '', data: '' });
      setShowEventForm(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEventos(eventos.filter(event => event.id !== eventId));
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const results = mockWorkers.filter(worker => 
        worker.codigo.toLowerCase().includes(value.toLowerCase()) ||
        worker.nome.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleConfirmPresence = (worker) => {
    if (!selectedEvent) {
      alert('Por favor, selecione um evento');
      return;
    }

    const evento = eventos.find(e => e.id === parseInt(selectedEvent));
    setSuccessMessage(`Presença confirmada para ${worker.nome} no evento ${evento.nome} - ${new Date(evento.data).toLocaleDateString('pt-BR')}`);

    setTimeout(() => {
      setSuccessMessage('');
      setSearchTerm('');
      setSearchResults([]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Controle de Eventos e Presenças</h2>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar
          </Button>
        </div>

        {/* Gestão de Eventos */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Eventos</h3>
            <Button
              onClick={() => setShowEventForm(!showEventForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>

          {/* Formulário de Novo Evento */}
          {showEventForm && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Nome do evento"
                  value={newEvent.nome}
                  onChange={(e) => setNewEvent({ ...newEvent, nome: e.target.value })}
                />
                <Input
                  type="date"
                  value={newEvent.data}
                  onChange={(e) => setNewEvent({ ...newEvent, data: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEventForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddEvent}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar Evento
                </Button>
              </div>
            </div>
          )}

          {/* Lista de Eventos */}
          <div className="space-y-2">
            {eventos.map(evento => (
              <div 
                key={evento.id}
                className="flex justify-between items-center p-3 bg-white rounded-lg border hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{evento.nome}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(evento.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(evento.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Controle de Presença */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Registro de Presença</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Evento *
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">Selecione um evento</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id}>
                  {evento.nome} - {new Date(evento.data).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="flex gap-4">
              <Input
                placeholder="Buscar trabalhador por código ou nome..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Resultados da busca */}
            {searchResults.length > 0 && (
              <Card className="absolute w-full mt-2 p-2 z-10 bg-white shadow-lg">
                {searchResults.map((worker) => (
                  <div
                    key={worker.codigo}
                    className="p-4 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{worker.nome}</p>
                      <p className="text-sm text-gray-600">{worker.codigo}</p>
                    </div>
                    <Button
                      onClick={() => handleConfirmPresence(worker)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar Presença
                    </Button>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </Card>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AttendanceControl;