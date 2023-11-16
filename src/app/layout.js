import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bloomingfoods HR Program',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="inline-flex flex-row w-full min-w-fit h-24 bg-cyan-950">
          <Navbar/>
        </header>
        <div className = "my-2 mx-5 max-w-max">
        {children}
        </div>
      </body>
    </html>
  )
}
