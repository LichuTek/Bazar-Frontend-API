'use client'

import { useState, useEffect } from 'react'

export default function ClientComponent() {
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString())
        }

        updateTime() // Set initial time
        const timer = setInterval(updateTime, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-indigo-800">Hora Actual</h2>
            <p className="text-gray-600">{currentTime}</p>
        </div>
    )
}

