import { ArrowRight } from 'lucide-react'
import ClientComponent from './components/ClientComponent'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">Bienvenido a la app de Gestion De Ventas!</h1>
      <p className="mb-4 text-gray-600">Esta es la pagina principal a la derecha tienes una barra lateral para navegar por las distintas funciones</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-800">Productos</h2>
          <p className="text-gray-600">En esta pantalla podrás gestionar los productos de la compania, con las opciones de crear, editar y borrarlos</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-800">Clientes</h2>
          <p className="text-gray-600">En este apartado podrás gestionar los clientes del negocio modificando sus datos.</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-800">Ventas</h2>
          <p className="text-gray-600">En este apartado podas crear, editar y eliminar ventas asociandas a un ID de cliente.</p>
        </div>
        <ClientComponent />
      </div>

    </div>
  )
}

