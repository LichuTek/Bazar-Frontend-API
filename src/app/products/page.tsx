import { ProductTable } from './ProductTable'

async function getProducts() {
    // In a real application, replace this URL with your actual API endpoint
    const res = await fetch('http://localhost:8080/productos')
    if (!res.ok) {
        throw new Error('Failed to fetch products')
    }
    return res.json()
}

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-indigo-800">Productos</h1>
            <ProductTable products={products} />
        </div>
    )
}

