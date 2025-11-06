import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../auth/role.definition'

interface Celebracao {
    id: number
    dataEvento: string
    tituloOpcional: string | null
    igreja: {
        nome: string
    }
    tipoCelebracao: {
        nome: string
    }
}

function formatarData(dataISO: string) {
    const data = new Date(dataISO)

    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function CelebracoesPage() {
    const [celebracoes, setCelebracoes] = useState<Celebracao[]>([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const { user } = useAuth()
    const isCoordenador = user?.role === ROLES.Coordenador

    useEffect(() => {
        const fetchCelebracoes = async () => {
            try {
                setLoading(true)

                const response = await axios.get(
                    'http://localhost:3000/celebracoes/minhas',
                )
                setCelebracoes(response.data)
            } catch (error) {
                console.error('Erro ao buscar celebrações:', error)
                alert('Não foi possível carregar as celebrações.')
            } finally {
                setLoading(false)
            }
        }

        fetchCelebracoes()
    }, [])

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando celebrações...</h1>
    }

    return (
        <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-3xl font-bold">Próximas Celebrações</h1>

                {isCoordenador && (
                    <button
                        onClick={() => navigate('/celebracoes/nova')}
                        className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-white shadow transition-colors hover:bg-blue-700">
                        + Agendar Nova Celebração
                    </button>
                )}
            </div>

            {celebracoes.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {celebracoes.map((evento) => (
                        // O CARD (Clicável)
                        <div
                            key={evento.id}
                            onClick={() => navigate(`/celebracoes/${evento.id}`)}
                            className="flex cursor-pointer flex-col justify-between rounded-lg bg-white p-5 shadow transition-shadow hover:shadow-md"
                        >
                            {/* Conteúdo do Card */}
                            <div>
                                <h3 className="truncate text-xl font-semibold text-gray-900" title={evento.tituloOpcional || evento.tipoCelebracao.nome}>
                                    {evento.tituloOpcional || evento.tipoCelebracao.nome}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {evento.igreja.nome}
                                </p>
                            </div>

                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <span className="text-base font-semibold text-blue-700">
                                    {formatarData(evento.dataEvento)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (

                <div className="rounded-lg bg-white p-10 text-center shadow">
                    <p className="text-gray-500">
                        Nenhuma celebração agendada.
                        {isCoordenador && " Que tal agendar uma?"}
                    </p>
                </div>
            )}
        </div>
    )
}