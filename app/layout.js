import './globals.css'

export const metadata = {
  title: 'Casa Espiritualista',
  description: 'Sistema da Casa Espiritualista',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
