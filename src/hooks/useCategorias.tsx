import { useState, useEffect } from 'react'
import axios from 'axios'

interface Categoria {
    id: number
    nome: string
}

export function useCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true)

                const response = await axios.get('http://localhost:3000/categorias')
                setCategorias(response.data)
            } catch (error) {
                console.error('Falha ao carregar categorias:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCategorias()
    }, [])

    return { categorias, loading }
}