"use client";
import React, { useState, useEffect } from 'react';
import { Card } from ""@/components/ui/card";
import { Button } from ""@/components/ui/button";
import { Input } from ""@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const router = useRouter();
  const [nextCode, setNextCode] = useState('CM0001');
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    dataNascimento: '',
    sexo: '',
    telefone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Aqui posteriormente vamos carregar os membros do banco para manter a sequência
    const existingMembers = [];
    setMembers(existingMembers);
    
    if (existingMembers.length > 0) {
      const lastCode = existingMembers[existingMembers.length - 1].codigo;
      const nextNumber = parseInt(lastCode.substring(2)) + 1;
      setNextCode(`CM${String(nextNumber).padStart(4, '0')}`);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const checkDuplicate = (nome, dataNascimento) => {
    return members.some(member => 
      member.nome.toLowerCase() === nome.toLowerCase() && 
      member.dataNascimento === dataNascimento
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.dataNascimento || !formData.sexo || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (checkDuplicate(formData.nome, formData.dataNascimento)) {
      setError('Membro já cadastrado! Verificamos um cadastro com o mesmo nome e data de nascimento.');
      return;
    }

    try {
      const newMember = { 
        ...formData, 
        codigo: nextCode,
        dataCadastro: new Date().toISOString()
      };

      setMembers([...members, newMember]);
      
      const nextNumber = parseInt(nextCode.substring(2)) + 1;
      setNextCode(`CM${String(nextNumber).padStart(4, '0')}`);
      
      setFormData({
        codigo: '',
        nome: '',
        dataNascimento: '',
        sexo: '',
        telefone: ''
      });
      
      setSuccess('Membro cadastrado com sucesso!');
      setError('');
    } catch (err) {
      setError('Erro ao cadastrar membro. Tente novamente.');
      console.error('Erro:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Cadastro de Membros</h2>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              Voltar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Identificação
              </label>
              <Input
                value={nextCode}
                disabled
                className="bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <Input
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="bg-white"
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <Input
                name="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <Input
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                className="bg-white"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Cadastrar Membro
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
