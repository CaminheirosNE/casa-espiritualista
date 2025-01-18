import React from 'react';
import Link from 'next/link';
import { Card } from "../components/ui/card";

const menuItems = [
  { 
    title: 'Cadastro de Membros', 
    icon: '📝', 
    path: '/cadastro',
    description: 'Cadastrar novos membros e trabalhadores'
  },
  { 
    title: 'Terapias', 
    icon: '🌟', 
    path: '/terapias',
    description: 'Distribuição de senhas para terapias'
  },
  { 
    title: 'Chamada de Senhas', 
    icon: '🎫', 
    path: '/chamada-senhas',
    description: 'Painel de chamada para o telão'
  },
  { 
    title: 'Eventos e Presenças', 
    icon: '📅', 
    path: '/presenca',
    description: 'Controle de eventos e lista de presença'
  },
  { 
    title: 'Aniversariantes', 
    icon: '🎂', 
    path: '/aniversariantes',
    description: 'Controle e visualização de aniversariantes'
  },
  { 
    title: 'Controle Financeiro', 
    icon: '💰', 
    path: '/financeiro',
    description: 'Gestão de mensalidades e gastos'
  },
  { 
    title: 'Relatório de Membros',
    icon: '👥',
    path: '/membros-relatorio',
    description: 'Gerenciar membros cadastrados'
  },
  { 
    title: 'Relatórios', 
    icon: '📊', 
    path: '/relatorios',
    description: 'Relatórios financeiros, cadastros e presenças'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="pt-8 pb-6 text-center">
        <div className="mx-auto w-[100px] h-[100px] mb-8 bg-white rounded-full shadow-lg p-4">
          <img
            src="/api/placeholder/100/100"
            alt="CM Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-12 px-4 text-center text-blue-900">
          BEM VINDO TRABALHADORES<br />
          CAMINHEIROS DA NOVA ERA
        </h1>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.title}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="w-full h-20 text-xl font-semibold text-white 
                             bg-blue-600 hover:bg-blue-700 
                             flex items-center gap-6
                             transition-all duration-300 px-8">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm font-normal opacity-80">{item.description}</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-600">
        <p>Administrador: Solange Schvarz</p>
      </footer>
    </div>
  );
};

export default HomePage;