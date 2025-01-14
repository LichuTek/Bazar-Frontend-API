import { Phone, Mail, MapPin } from 'lucide-react'
import { VentasTable } from './VentasTable'
export default function Contact() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-indigo-800">Ventas</h1>
            <VentasTable />
        </div>
    )
}

