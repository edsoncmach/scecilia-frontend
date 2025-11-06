import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface CelebracaoTipo {
    id: number
    nome: string
}
interface Igreja {
    id: number
    nome: string
}

export function CelebracaoCreatePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [dataEvento, setDataEvento] = useState('')
    const [tipoId, setTipoId] = useState('')
    const [igrejaId, setIgrejaId] = useState('')
    const [tituloOpcional, setTituloOpcional] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [tipos, setTipos] = useState<CelebracaoTipo[]>([])
    const [igrejas, setIgrejas] = useState<Igreja[]>([])

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/celebracoes/tipos',
                )
                setTipos(response.data)
            } catch (error) {
                console.error('Erro ao buscar tipos de celebração:', error)
            }
        }

        const fetchIgrejas = async () => {
            if (!user?.contexto?.paroquiaId) {
                console.error('ID da Paróquia não encontrado no contexto!')
                return
            }

            try {
                const paroquiaId = user.contexto.paroquiaId
                const response = await axios.get(
                    `http://localhost:3000/organizacao/paroquia/${paroquiaId}/igrejas`,
                )
                setIgrejas(response.data)
            } catch (error) {
                console.error('Erro ao buscar igrejas:', error)
            }
        }

        fetchTipos()
        fetchIgrejas()
    }, [user])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        const novaCelebracaoDto = {
            dataEvento,
            tipoCelebracaoId: parseInt(tipoId, 10),
            igrejaId: parseInt(igrejaId, 10),
            tituloOpcional: tituloOpcional || null,
        }

        try {
            await axios.post('http://localhost:3000/celebracoes', novaCelebracaoDto)
            alert('Celebração agendada com sucesso!')
            navigate('/celebracoes')
        } catch (error) {
            console.error('Erro ao agendar celebração:', error)
            alert('Falha ao agendar. Verifique os campos.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Agendar Nova Celebração</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-lg"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="dataEvento" className="mb-2 block text-sm font-medium text-gray-700">
                            Data e Hora
                        </label>
                        <input
                            id="dataEvento"
                            type="datetime-local"
                            value={dataEvento}
                            onChange={(e) => setDataEvento(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Padding p-3
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="titulo" className="mb-2 block text-sm font-medium text-gray-700">
                            Título Opcional (ex: Missa das Crianças)
                        </label>
                        <input
                            id="titulo"
                            type="text"
                            value={tituloOpcional}
                            onChange={(e) => setTituloOpcional(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Padding p-3
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="tipo" className="mb-2 block text-sm font-medium text-gray-700">
                            Tipo de Celebração
                        </label>
                        <select
                            id="tipo"
                            value={tipoId}
                            onChange={(e) => setTipoId(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Padding p-3
                            required
                        >
                            <option value="" disabled>Selecione um tipo...</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="igreja" className="mb-2 block text-sm font-medium text-gray-700">
                            Igreja (da sua Paróquia)
                        </label>
                        <select
                            id="igreja"
                            value={igrejaId}
                            onChange={(e) => setIgrejaId(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Padding p-3
                            required
                        >
                            <option value="" disabled>Selecione uma igreja...</option>
                            {igrejas.map((igreja) => (
                                <option key={igreja.id} value={igreja.id}>{igreja.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/celebracoes')}
                        className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300" // Estilo padronizado
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-700 disabled:opacity-50" // Estilo padronizado
                    >
                        {isLoading ? 'Agendando...' : 'Agendar Celebração'}
                    </button>
                </div>
            </form>
        </div>
    )
}