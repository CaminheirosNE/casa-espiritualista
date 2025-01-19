import './styles/globals.css'

export const metadata = {
  title: 'Casa Espiritualista',
  description: 'Sistema de gerenciamento para casa espírita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
