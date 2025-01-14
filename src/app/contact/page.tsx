import { Phone, Mail, MapPin } from 'lucide-react'

export default function Contact() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-indigo-800">Contact Us</h1>
            <p className="mb-4 text-gray-600">Get in touch with us using the information below:</p>
            <div className="space-y-4">
                <div className="flex items-center">
                    <Phone className="mr-3 text-indigo-600" size={20} />
                    <span>+1 (123) 456-7890</span>
                </div>
                <div className="flex items-center">
                    <Mail className="mr-3 text-indigo-600" size={20} />
                    <span>contact@example.com</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="mr-3 text-indigo-600" size={20} />
                    <span>123 Main St, City, Country</span>
                </div>
            </div>
        </div>
    )
}

