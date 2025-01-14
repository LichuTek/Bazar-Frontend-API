'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Producto = {
    codigo_producto: number
    nombre: string
    costo: number
}

type Cliente = {
    id_cliente: number
    nombre: string
    apellido: string
}

type Venta = {
    codigo_venta?: number
    fecha_venta: string
    total: number
    listaProductos: { codigo_producto: number }[]
    unCliente: Cliente | null
}

export function VentasTable() {
    const [ventas, setVentas] = useState<Venta[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [productos, setProductos] = useState<Producto[]>([])
    const [selectedVenta, setSelectedVenta] = useState<Venta>({
        fecha_venta: new Date().toISOString().split('T')[0],
        total: 0,
        listaProductos: [],
        unCliente: null
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    const fetchClientes = async () => {
        try {
            const response = await fetch('http://localhost:8080/clientes')
            const data = await response.json()
            setClientes(data)
        } catch (error) {
            console.error(error)
            toast.error('Error al obtener los clientes')
        }
    }

    const fetchProductos = async () => {
        try {
            const response = await fetch('http://localhost:8080/productos')
            const data = await response.json()
            setProductos(data)
        } catch (error) {
            console.error(error)
            toast.error('Error al obtener los productos')
        }
    }

    const fetchVentas = async () => {
        try {
            const response = await fetch('http://localhost:8080/ventas')
            const data = await response.json()
            setVentas(data)
        } catch (error) {
            console.error(error)
            toast.error('Error al obtener las ventas')
        }
    }

    useEffect(() => {
        fetchClientes()
        fetchProductos()
        fetchVentas()
    }, [])

    const handleDelete = async (codigo_venta: number) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta venta?')
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/ventas/eliminar/${codigo_venta}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    toast.success('Venta eliminada exitosamente')
                    fetchVentas()
                } else {
                    toast.error('Error al eliminar la venta')
                }
            } catch (error) {
                console.error(error)
                toast.error('Error al conectar con el servidor')
            }
        }
    }

    const handleEdit = (venta: Venta) => {
        setSelectedVenta(venta)
        setIsEditMode(true)
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!selectedVenta.unCliente) return

        const endpoint = isEditMode
            ? `http://localhost:8080/ventas/editar/${selectedVenta.codigo_venta}`
            : 'http://localhost:8080/ventas/crear'

        try {
            const response = await fetch(endpoint, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedVenta),
            })

            if (response.ok) {
                toast.success(isEditMode ? 'Venta editada exitosamente' : 'Venta creada exitosamente')
                setIsModalOpen(false)
                setIsEditMode(false)
                fetchVentas()
            } else {
                toast.error('Error al guardar la venta')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al conectar con el servidor')
        }
    }

    const handleAddProduct = (producto: Producto) => {
        const newListaProductos = [...selectedVenta.listaProductos, { codigo_producto: producto.codigo_producto }];

        // Calcula el nuevo total correctamente
        const total = newListaProductos.reduce((sum, item) => {
            const prod = productos.find(p => p.codigo_producto === item.codigo_producto);
            return sum + (prod && !isNaN(prod.costo) ? prod.costo : 0);
        }, 0);

        setSelectedVenta({ ...selectedVenta, listaProductos: newListaProductos, total });
    }

    const handleRemoveProduct = (codigo_producto: number) => {
        const newListaProductos = selectedVenta.listaProductos.filter(item => item.codigo_producto !== codigo_producto)

        // Calcula el nuevo total después de eliminar el producto
        const total = newListaProductos.reduce((sum, item) => {
            const prod = productos.find(p => p.codigo_producto === item.codigo_producto)
            const costo = prod ? (typeof prod.costo === 'number' && !isNaN(prod.costo) ? prod.costo : 0) : 0
            return sum + costo
        }, 0)

        setSelectedVenta({ ...selectedVenta, listaProductos: newListaProductos, total })
    }

    const handleNewVenta = () => {
        setSelectedVenta({
            fecha_venta: new Date().toISOString().split('T')[0],
            total: 0,
            listaProductos: [],
            unCliente: null
        })
        setIsEditMode(false)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleNewVenta}
                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mb-4"
            >
                Agregar Nueva Venta
            </button>

            <input
                type="text"
                placeholder="Buscar ventas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm p-2 border rounded-md focus:outline-none ml-4"
            />

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-center">ID</th>
                        <th className="px-4 py-2 text-center">Fecha</th>
                        <th className="px-4 py-2 text-center">Total</th>
                        <th className="px-4 py-2 text-center">Cliente</th>
                        <th className="px-4 py-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas
                        .filter((venta) => {
                            // Verifica si hay un cliente y filtra por nombre o apellido
                            const clienteNombreApellido = venta.unCliente
                                ? `${venta.unCliente.nombre} ${venta.unCliente.apellido}`.toLowerCase()
                                : '';
                            return clienteNombreApellido.includes(searchTerm.toLowerCase()) ||
                                venta.fecha_venta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                venta.total.toString().includes(searchTerm);
                        })
                        .map((venta) => (
                            <tr key={venta.codigo_venta}>
                                <td className="px-4 py-2 text-center">{venta.codigo_venta}</td>
                                <td className="px-4 py-2 text-center">{venta.fecha_venta}</td>
                                <td className="px-4 py-2 text-center">${venta.total}</td>
                                <td className="px-4 py-2 text-center">
                                    {venta.unCliente?.nombre} {venta.unCliente?.apellido}
                                </td>
                                <td className="px-4 py-2 text-center flex justify-center space-x-2">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                                        onClick={() => handleEdit(venta)}
                                    >
                                        <Pencil />
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                                        onClick={() => handleDelete(venta.codigo_venta!)}
                                    >
                                        <Trash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Editar Venta' : 'Agregar Venta'}</h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSave()
                            }}
                        >
                            <input
                                type="date"
                                value={selectedVenta.fecha_venta}
                                onChange={(e) => setSelectedVenta({ ...selectedVenta, fecha_venta: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />

                            <select
                                onChange={(e) => {
                                    const cliente = clientes.find(cli => cli.id_cliente === parseInt(e.target.value))
                                    if (cliente) setSelectedVenta({ ...selectedVenta, unCliente: cliente })
                                }}
                                value={selectedVenta.unCliente?.id_cliente?.toString() || ""}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                                        {cliente.nombre} {cliente.apellido}
                                    </option>
                                ))}
                            </select>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Productos</h3>
                                <div className="space-y-2">
                                    {productos.map(producto => (
                                        <div key={producto.codigo_producto} className="flex justify-between items-center">
                                            <span>{producto.nombre}</span>
                                            <button
                                                type="button"
                                                className="bg-blue-500 text-white py-1 px-2 rounded"
                                                onClick={() => handleAddProduct(producto)}
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <h4 className="mt-4 font-semibold">Productos Seleccionados:</h4>
                                <div className="space-y-2">
                                    {selectedVenta.listaProductos.map(item => {
                                        const producto = productos.find(p => p.codigo_producto === item.codigo_producto)
                                        return (
                                            <div key={item.codigo_producto} className="flex justify-between items-center">
                                                <span>{producto?.nombre}</span>
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                                    onClick={() => handleRemoveProduct(item.codigo_producto)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Total: ${selectedVenta.total}</h3>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                >
                                    {isEditMode ? 'Guardar cambios' : 'Crear venta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    )
}
