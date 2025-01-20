import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Pencil, Save } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const BirthdayScreen = () => {
  const [members, setMembers] = useState([]);
  const [birthdayMessage, setBirthdayMessage] = useState(
    "Feliz aniversário! 🎉 Que seu dia seja repleto de alegria e bênçãos. 🙏✨"
  );
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState(birthdayMessage);

  // Simulação de dados
  useEffect(() => {
    const mockMembers = [
      { codigo: 'CM0001', nome: 'João Silva', dataNascimento: '1990-01-12', telefone: '(11) 98765-4321' },
      { codigo: 'CM0002', nome: 'Maria Santos', dataNascimento: '1985-01-22', telefone: '(11) 91234-5678' },
      { codigo: 'CM0003', nome: 'Pedro Oliveira', dataNascimento: '1995-02-10', telefone: '(11) 99876-5432' },
    ];
    setMembers(mockMembers);
  }, []);

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

  const isBirthday = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getDate() === birth.getDate() && 
           today.getMonth() === birth.getMonth();
  };

  const isCurrentMonth = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getMonth() === birth.getMonth();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getBirthdayMembers = () => {
    return members.filter(member => isBirthday(member.dataNascimento));
  };

  const getMonthBirthdayMembers = () => {
    return members
      .filter(member => isCurrentMonth(member.dataNascimento) && !isBirthday(member.dataNascimento))
      .sort((a, b) => new Date(a.dataNascimento).getDate() - new Date(b.dataNascimento).getDate());
  };

  const handleSaveMessage = () => {
    setBirthdayMessage(newMessage);
    setIsEditingMessage(false);
  };

  const openWhatsAppWithMessage = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(birthdayMessage);
    window.open(`https://wa.me/55${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  const BirthdayCard = ({ title, members, showDate = false }) => (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">{title}</h3>
      {members.length === 0 ? (
        <p className="text-gray-500">Nenhum aniversariante encontrado.</p>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.codigo} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h4 className="font-semibold text-lg">{member.nome}</h4>
                <p className="text-gray-600">
                  {showDate && `Data: ${formatDate(member.dataNascimento)}`}
                  {showDate && ' • '}
                  Idade: {calculateAge(member.dataNascimento)} anos
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => openWhatsAppWithMessage(member.telefone)}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Aniversariantes</h2>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar
          </Button>
        </div>

        {/* Mensagem de Aniversário Editável */}
        <Card className="p-6 mb-6 bg-blue-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Mensagem de Aniversário</h3>
            {!isEditingMessage ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingMessage(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveMessage}
                className="text-green-600 hover:text-green-700"
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
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">{birthdayMessage}</p>
          )}
        </Card>

        {/* Aniversariantes do Dia */}
        <BirthdayCard 
          title="🎂 Aniversariantes do Dia" 
          members={getBirthdayMembers()} 
        />

        {/* Aniversariantes do Mês */}
        <BirthdayCard 
          title="📅 Outros Aniversariantes do Mês" 
          members={getMonthBirthdayMembers()} 
          showDate={true}
        />
      </div>
    </div>
  );
};

export default BirthdayScreen;