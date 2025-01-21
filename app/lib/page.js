"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Card } from "@/components/ui/card";
import { menuItems } from '@/app/lib/constants';

const MenuCard = ({ title, icon, description }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
    <div className="w-full h-20 text-xl font-semibold text-white 
                  bg-blue-600 hover:bg-blue-700 
                  flex items-center gap-6
                  transition-all duration-300 px-8">
      <span className="text-3xl flex-shrink-0" aria-hidden="true">{icon}</span>
      <div className="text-left flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm font-normal opacity-80">{description}</div>
      </div>
    </div>
  </Card>
);

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Caminheiros da Nova Era - Área dos Trabalhadores</title>
        <meta name="description" content="Sistema de gestão para trabalhadores da Casa Espiritualista Caminheiros da Nova Era" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="pt-4 md:pt-8 pb-4 md:pb-6 text-center">
          <div className="mx-auto w-[80px] md:w-[100px] h-[80px] md:h-[100px] mb-4 md:mb-8 bg-white rounded-full shadow-lg p-4 relative">
            <Image
              src="/CM.png"
              alt="CM Logo"
              fill
              sizes="(max-width: 768px) 80px, 100px"
              priority
              className="object-contain p-2"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 px-4 text-center text-blue-900">
            BEM VINDO TRABALHADORES<br />
            CAMINHEIROS DA NOVA ERA
          </h1>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 pb-16">
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Link 
                href={item.path} 
                key={item.title} 
                className={`block ${isLoading ? 'animate-pulse' : ''}`}
                aria-label={`Ir para ${item.title}`}
              >
                <MenuCard 
                  title={item.title}
                  icon={item.icon}
                  description={item.description}
                />
              </Link>
            ))}
          </div>
        </main>

        <footer className="text-center py-4 text-sm text-gray-600">
          <p>Administrador: Solange Schvarz</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;