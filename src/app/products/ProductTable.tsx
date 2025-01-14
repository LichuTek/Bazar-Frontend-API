'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Product = {
    codigo_producto: number
    cantidad_disponible: number
    costo: number
    nombre: string
    marca: string
}

export function ProductTable({ products }: { products: Product[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleDelete = async (codigo_producto: number) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?')
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/productos/eliminar/${codigo_producto}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    toast.success('Producto eliminado exitosamente')
                } else {
                    toast.error('Error al eliminar el producto')
                }
            } catch (error) {
                console.error(error)
                toast.error('Error al conectar con el servidor')
            }
        }
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsEditMode(true)
        setIsModalOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!selectedProduct) return

        try {
            const url = isEditMode
                ? `http://localhost:8080/productos/editar/${selectedProduct.codigo_producto}`
                : 'http://localhost:8080/productos/crear'

            const method = isEditMode ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cantidad_disponible: selectedProduct.cantidad_disponible,
                    costo: selectedProduct.costo,
                    nombre: selectedProduct.nombre,
                    marca: selectedProduct.marca,
                }),
            })

            if (response.ok) {
                toast.success(isEditMode ? 'Producto editado exitosamente' : 'Producto creado exitosamente')
                setIsModalOpen(false) // Cerrar modal
                setIsEditMode(false) // Resetear el modo de edición
                setSelectedProduct(null) // Resetear el producto seleccionado
            } else {
                toast.error('Error al guardar el producto')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al conectar con el servidor')
        }
    }

    return (
        <div className="space-y-4">
            {/* Botón para agregar un nuevo producto */}
            <button
                onClick={() => {
                    setIsEditMode(false)
                    setSelectedProduct(null)
                    setIsModalOpen(true)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded shadow mb-4"
            >
                Agregar Producto
            </button>

            <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product.codigo_producto}>
                            <TableCell>{product.codigo_producto}</TableCell>
                            <TableCell>{product.cantidad_disponible}</TableCell>
                            <TableCell>${product.costo.toFixed(2)}</TableCell>
                            <TableCell>{product.nombre}</TableCell>
                            <TableCell>{product.marca}</TableCell>
                            <TableCell>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded shadow transition duration-200"
                                    onClick={() => handleEdit(product)}
                                >
                                    <Pencil />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded shadow transition duration-200 ml-1"
                                    onClick={() => handleDelete(product.codigo_producto)}
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
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSaveEdit()
                            }}
                        >
                            <Input
                                type="text"
                                placeholder="Nombre"
                                value={selectedProduct?.nombre || ''}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct!, nombre: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Marca"
                                value={selectedProduct?.marca || ''}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct!, marca: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Cantidad disponible"
                                value={selectedProduct?.cantidad_disponible || ''}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct!,
                                        cantidad_disponible: Number(e.target.value),
                                    })
                                }
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Costo"
                                value={selectedProduct?.costo || ''}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct!, costo: Number(e.target.value) })
                                }
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setIsEditMode(false)
                                        setSelectedProduct(null)
                                    }}
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
