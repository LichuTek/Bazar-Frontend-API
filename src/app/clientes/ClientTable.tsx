'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Cliente = {
    id_cliente?: number
    nombre: string
    apellido: string
    dni: string
}

export function ClienteTable() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

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

    useEffect(() => {
        fetchClientes()
    }, [])

    const filteredClientes = clientes.filter(cliente =>
        Object.values(cliente).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleDelete = async (id_cliente: number) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este cliente?')
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/clientes/eliminar/${id_cliente}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    toast.success('Cliente eliminado exitosamente')
                    fetchClientes()
                } else {
                    toast.error('Error al eliminar el cliente')
                }
            } catch (error) {
                console.error(error)
                toast.error('Error al conectar con el servidor')
            }
        }
    }

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditMode(true)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedCliente({ nombre: '', apellido: '', dni: '' })
        setIsEditMode(false)
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!selectedCliente) return

        const endpoint = isEditMode
            ? `http://localhost:8080/clientes/editar/${selectedCliente.id_cliente}`
            : 'http://localhost:8080/clientes/crear'

        try {
            const response = await fetch(endpoint, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedCliente),
            })

            if (response.ok) {
                toast.success(isEditMode ? 'Cliente editado exitosamente' : 'Cliente creado exitosamente')
                setIsModalOpen(false)
                setIsEditMode(false)
                fetchClientes()
            } else {
                toast.error('Error al guardar el cliente')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al conectar con el servidor')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={handleAdd}
                >
                    <PlusCircle className="mr-2" /> Agregar Cliente
                </button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente}>
                            <TableCell>{cliente.id_cliente}</TableCell>
                            <TableCell>{cliente.nombre}</TableCell>
                            <TableCell>{cliente.apellido}</TableCell>
                            <TableCell>{cliente.dni}</TableCell>
                            <TableCell>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded shadow transition duration-200"
                                    onClick={() => handleEdit(cliente)}
                                >
                                    <Pencil />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded shadow transition duration-200 ml-1"
                                    onClick={() => handleDelete(cliente.id_cliente!)}
                                >
                                    <Trash2 />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault()
                            handleSave()
                        }}>
                            <Input
                                type="text"
                                placeholder="Nombre"
                                value={selectedCliente?.nombre || ''}
                                onChange={(e) =>
                                    setSelectedCliente({ ...selectedCliente!, nombre: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Apellido"
                                value={selectedCliente?.apellido || ''}
                                onChange={(e) =>
                                    setSelectedCliente({ ...selectedCliente!, apellido: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="text"
                                placeholder="DNI"
                                value={selectedCliente?.dni || ''}
                                onChange={(e) =>
                                    setSelectedCliente({ ...selectedCliente!, dni: e.target.value })
                                }
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Guardar
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
