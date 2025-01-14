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
type Product2 = {
    cantidad_disponible: number
    costo: number
    nombre: string
    marca: string
}

export function ProductTable({ products }: { products: Product[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newProduct, setNewProduct] = useState<Product>({
        codigo_producto: 0,
        cantidad_disponible: 0,
        costo: 0,
        nombre: '',
        marca: '',
    })
    const [newProduct2, setNewProduct2] = useState<Product2>({
        cantidad_disponible: 0,
        costo: 0,
        nombre: '',
        marca: '',
    })

    const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleDelete = async (codigo_producto: number) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?')
        if (confirmed) {
            try {
                console.log(codigo_producto)
                const response = await fetch(`http://localhost:8080/productos/eliminar/${codigo_producto}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    toast.success('Producto eliminado exitosamente')
                    // Aquí puedes actualizar el estado local eliminando el producto de la tabla
                } else {
                    toast.error('Error al eliminar el producto')
                }
            } catch (error) {
                console.error(error)
                toast.error('Error al conectar con el servidor')
            }
        }
    }

    const handleAddProduct = async () => {
        try {
            const response = await fetch('http://localhost:8080/productos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct2),
            })

            if (response.ok) {
                toast.success('Producto agregado exitosamente')
                // Aquí puedes hacer cualquier otra cosa, como actualizar el estado o cerrar el modal.
                setIsModalOpen(false)
            } else {
                toast.error('Error al agregar el producto')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al conectar con el servidor')
        }
    }


    return (
        <div className="space-y-4">
            {/* Input de búsqueda */}
            <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            {/* Botón agregar producto */}
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200"
                onClick={() => setIsModalOpen(true)}
            >
                Agregar Producto
            </button>

            {/* Tabla de productos */}
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
                                {/* Botón Editar */}
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded shadow transition duration-200"
                                    onClick={() => console.log("Editar")}
                                >
                                    <Pencil />
                                </button>

                                {/* Botón Borrar */}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault()
                            handleAddProduct()
                        }}>

                            <h2 className="text-sm font-semibold mb-4">Nombre del producto</h2>
                            <Input
                                type="text"
                                placeholder="Nombre"
                                value={newProduct2.nombre}
                                onChange={(e) => setNewProduct2({ ...newProduct2, nombre: e.target.value })}
                                required
                            />
                            <h2 className="text-sm font-semibold mb-4">Marca del Producto</h2>
                            <Input
                                type="text"
                                placeholder="Marca"
                                value={newProduct2.marca}
                                onChange={(e) => setNewProduct2({ ...newProduct2, marca: e.target.value })}
                                required
                            />
                            <h2 className="text-sm font-semibold mb-4">Stock Disponible: </h2>

                            <Input
                                type="number"
                                placeholder="Cantidad disponible"
                                value={newProduct2.cantidad_disponible}
                                onChange={(e) => setNewProduct2({ ...newProduct2, cantidad_disponible: Number(e.target.value) })}
                                required
                            />
                            <h2 className="text-sm font-semibold mb-4">Costo del producto: </h2>
                            <Input
                                type="number"
                                placeholder="Costo"
                                value={newProduct2.costo}
                                onChange={(e) => setNewProduct2({ ...newProduct2, costo: Number(e.target.value) })}
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
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Componente Toastify */}
            <ToastContainer />
        </div>
    )
}
