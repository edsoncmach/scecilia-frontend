import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CifraViewer } from '../components/CifraViewer'
import { useReactToPrint } from 'react-to-print'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../auth/role.definition'

interface CifraNoSetlist {
    tomExecucao: string
    ordem: number
    cifra: {
        id: number
        nomeMusica: string
        interprete: string
        conteudoChordpro: string
    }
}
interface CelebracaoDetalhe {
    id: number
    dataEvento: string
    tituloOpcional: string | null
    igreja: { nome: string }
    tipoCelebracao: { nome: string }
    grupo: { nome: string }
    cifras: CifraNoSetlist[]
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

export function CelebracaoDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { user } = useAuth()
    const isCoordenador = user?.role === ROLES.Coordenador

    const [celebracao, setCelebracao] = useState<CelebracaoDetalhe | null>(null)
    const [loading, setLoading] = useState(true)

    const setlistRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!id) return

        const fetchCelebracao = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `http://localhost:3000/celebracoes/${id}`,
                )
                setCelebracao(response.data)
            } catch (error) {
                console.error('Erro ao buscar detalhes da celebração:', error)
                alert('Não foi possível carregar a celebração.')
            } finally {
                setLoading(false)
            }
        }

        fetchCelebracao()
    }, [id])

    const handlePrint = useReactToPrint({
        contentRef: setlistRef,

        documentTitle:
            celebracao?.tituloOpcional ||
            celebracao?.tipoCelebracao.nome ||
            'setlist',

        pageStyle: `
            @page { 
                size: auto;
                margin: 15mm; 
            }
        `,
    })

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando celebração...</h1>
    }
    if (!celebracao) {
        return <h1 className="text-2xl font-bold">Celebração não encontrada.</h1>
    }

    return (
        <div>
            <Link to="/celebracoes" className="text-blue-600 hover:underline">
                &larr; Voltar para a lista
            </Link>

            <div className="my-4 rounded-lg bg-white p-6 shadow">
                <h1 className="text-3xl font-bold">
                    {celebracao.tituloOpcional || celebracao.tipoCelebracao.nome}
                </h1>
                <p className="mt-2 text-lg text-gray-700">
                    {formatarData(celebracao.dataEvento)}
                </p>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>Local: {celebracao.igreja.nome}</span>
                    <span>Grupo: {celebracao.grupo.nome}</span>
                </div>
            </div>

            <div className="my-4 flex gap-4">
                {isCoordenador && (
                    <button
                        onClick={() => navigate(`/celebracoes/${id}/editar`)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow transition-colors hover:bg-blue-700">
                        Montar Setlist (Editar)
                    </button>
                )}
                <button
                    onClick={() => {
                        if (!setlistRef.current) {
                            console.error('Elemento para impressão não encontrado.')
                            return
                        }

                        handlePrint()
                    }}
                    className="rounded-lg bg-gray-600 px-5 py-2 text-white shadow transition-colors hover:bg-gray-700">
                    Gerar PDF
                </button>
            </div>
            <div ref={setlistRef} id="pritable-area">
                <h2 className="mb-4 text-2xl font-semibold">Setlist</h2>
                <div className="space-y-4">
                    {celebracao.cifras.length > 0 ? (
                        celebracao.cifras.map((item) => (
                            <div key={item.cifra.id} className="rounded-lg bg-white p-6 shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {item.cifra.nomeMusica}
                                        </h3>
                                        <p className="text-md text-gray-600">{item.cifra.interprete}</p>
                                    </div>
                                    <span className="rounded-full bg-blue-100 px-4 py-2 text-lg font-bold text-blue-800">
                                        Tom: {item.tomExecucao}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <CifraViewer rawText={item.cifra.conteudoChordpro} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg bg-white p-6 text-center shadow">
                            <p className="text-gray-500">Nenhuma cifra definida para esta celebração.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}