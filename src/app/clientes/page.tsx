import { Phone, Mail, MapPin } from 'lucide-react'
import { ClienteTable } from './ClientTable'
export default function Contact() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-indigo-800">Clientes</h1>
            <ClienteTable />
        </div>
    )
}

