'use client'

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'
import { Home, Menu, X, ShoppingBag, UserRound, ShoppingBasket } from 'lucide-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        {/* Vertical Navigation Bar */}
        <nav className={`fixed top-0 left-0 h-full bg-indigo-800 text-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-64' : 'w-16'} overflow-hidden`}>
          <div className="p-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl font-bold mb-8 flex items-center w-full"
            >
              {isMenuOpen ? (
                <>
                  <Menu className="mr-2" />
                  Ventas
                </>
              ) : (
                <X />
              )}
            </button>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center p-3 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
                  <Home className="mr-3" size={20} />
                  {isMenuOpen && 'Inicio'}
                </Link>
              </li>
              <li>
                <Link href="/products" className="flex items-center p-3 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
                  <ShoppingBag className="mr-3" size={20} />
                  {isMenuOpen && 'Productos'}
                </Link>
              </li>
              <li>
                <Link href="/clientes" className="flex items-center p-3 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
                  <UserRound className="mr-3" size={20} />
                  {isMenuOpen && 'Clientes'}
                </Link>
              </li>
              <li>
                <Link href="/ventas" className="flex items-center p-3 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
                  <ShoppingBasket className="mr-3" size={20} />
                  {isMenuOpen && 'Ventas'}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={`flex-1 p-8 overflow-auto transition-all duration-300 ease-in-out ${isMenuOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}

