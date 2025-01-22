'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadRelatorios() {
      try {
        const response = await fetch('/api/relatorios')
        if (!response.ok) {
          throw new Error('Falha ao carregar relatórios')
        }
        const data = await response.json()
        setRelatorios(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadRelatorios()
  }, [])

  if (loading) return <div>Carregando...</div>
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          {relatorios.map((relatorio, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">{relatorio.titulo}</h3>
              <p>{relatorio.descricao}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
