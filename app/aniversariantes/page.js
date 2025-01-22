'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Pencil, Save } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

// Função auxiliar para calcular idade
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

// Componente do cartão de aniversariante
const BirthdayCard = ({ title, members, showDate = false, onSendMessage }) => (
  <Card className="p-6 mb-6">
    <h3 className="text-xl font-bold text-blue-900 mb-4">{title}</h3>
    {members.length === 0 ? (
      <p className="text-gray-500">Nenhum aniversariante encontrado.</p>
    ) : (
      <div className="space-y-4">
        {members.map((member) => (
          <div 
            key={member.codigo} 
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold text-lg">{member.nome}</h4>
              <p className="text-gray-600">
                {showDate && `Data: ${new Date(member.dataNascimento).toLocaleDateString('pt-BR')}`}
                {showDate && ' • '}
                Idade: {calculateAge(member.dataNascimento)} anos
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onSendMessage(member.telefone)}
              aria-label={`Enviar mensagem de aniversário para ${member.nome}`}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// Componente principal
export default function AniversariantesPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [birthdayMessage, setBirthdayMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('birthdayMessage') || 
        "Feliz aniversário! 🎉 Que seu dia seja repleto de alegria e bênçãos. 🙏✨"
    }
    return "Feliz aniversário! 🎉 Que seu dia seja repleto de alegria e bênçãos. 🙏✨";
  });
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState(birthdayMessage);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAniversariantes() {
      try {
        const response = await fetch('/api/aniversariantes');
        if (!response.ok) {
          throw new Error('Falha ao carregar aniversariantes');
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAniversariantes();
  }, []);

  const handleSaveMessage = () => {
    if (newMessage.trim()) {
      setBirthdayMessage(newMessage);
      localStorage.setItem('birthdayMessage', newMessage);
      setIsEditingMessage(false);
      setError('');
    } else {
      setError('A mensagem não pode estar vazia');
    }
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const openWhatsAppWithMessage = (phone) => {
    try {
      const formattedPhone = phone.replace(/\D/g, '');
      if (!validatePhone(formattedPhone)) {
        setError('Número de telefone inválido');
        return;
      }
      const encodedMessage = encodeURIComponent(birthdayMessage);
      window.open(`https://wa.me/55${formattedPhone}?text=${encodedMessage}`, '_blank');
      setError('');
    } catch (err) {
      setError('Erro ao tentar abrir o WhatsApp');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  const isBirthday = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return today.getDate() === birthDate.getDate() && 
           today.getMonth() === birthDate.getMonth();
  };

  const isCurrentMonth = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return today.getMonth() === birthDate.getMonth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Aniversariantes</h2>
          <Button 
            variant="outline"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6 mb-6 bg-blue-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Mensagem de Aniversário</h3>
            {!isEditingMessage ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingMessage(true)}
                className="text-blue-600 hover:text-blue-700"
                aria-label="Editar mensagem de aniversário"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveMessage}
                className="text-green-600 hover:text-green-700"
                aria-label="Salvar mensagem de aniversário"
              >
                <Save className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {isEditingMessage ? (
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full"
              placeholder="Digite a mensagem de aniversário..."
              aria-label="Mensagem de aniversário"
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">{birthdayMessage}</p>
          )}
        </Card>

        <BirthdayCard 
          title="🎂 Aniversariantes do Dia" 
          members={members.filter(member => isBirthday(member.dataNascimento))} 
          onSendMessage={openWhatsAppWithMessage}
        />

        <BirthdayCard 
          title="📅 Outros Aniversariantes do Mês" 
          members={members
            .filter(member => isCurrentMonth(member.dataNascimento) && !isBirthday(member.dataNascimento))
            .sort((a, b) => new Date(a.dataNascimento).getDate() - new Date(b.dataNascimento).getDate())
          } 
          showDate={true}
          onSendMessage={openWhatsAppWithMessage}
        />
      </div>
    </div>
  );
}
