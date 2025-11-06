import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { CifraViewer } from '../components/CifraViewer'

interface Cifra {
    id: number
    nomeMusica: string
    interprete: string
    tomOriginal: string
    conteudoChordpro: string
}

export function CifraViewPage() {
    const { id } = useParams<{ id: string }>()
    const [cifra, setCifra] = useState<Cifra | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchCifra = async () => {
            try {
                setLoading(true)

                const response = await axios.get(`http://localhost:3000/cifras/${id}`)
                setCifra(response.data)
            } catch (error) {
                console.error('Erro ao buscar cifra:', error)
                alert('Cifra não encontrada ou você não tem permissão.')
            } finally {
                setLoading(false)
            }
        }

        fetchCifra()
    }, [id])

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando cifra...</h1>
    }

    if (!cifra) {
        return <h1 className="text-2xl font-bold">Cifra não encontrada.</h1>
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <Link to="/cifras" className="text-blue-600 hover:underline">
                    &larr; Voltar para o Acervo
                </Link>

            </div>

            <div className="mb-4 rounded-lg bg-white p-6 shadow">
                <h1 className="text-3xl font-bold">{cifra.nomeMusica}</h1>
                <p className="mt-1 text-lg text-gray-700">
                    Intérprete: {cifra.interprete}
                </p>
                <p className="text-md text-gray-500">
                    Tom Original: {cifra.tomOriginal}
                </p>
            </div>

            <CifraViewer rawText={cifra.conteudoChordpro} />
        </div>
    )
}