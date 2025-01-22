'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Aniversariantes() {
  const [aniversariantes, setAniversariantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadAniversariantes() {
      try {
        const response = await fetch('/api/aniversariantes')
        if (!response.ok) {
          throw new Error('Falha ao carregar aniversariantes')
        }
        const data = await response.json()
        setAniversariantes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAniversariantes()
  }, [])

  if (loading) return <div>Carregando...</div>

  if (error) return <div>Erro: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Aniversariantes do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          {aniversariantes.map((pessoa, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-medium">{pessoa.nome}</h3>
              <p>Data: {pessoa.data}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
