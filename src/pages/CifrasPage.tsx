import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategorias'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../auth/role.definition'


interface Cifra {
    id: number
    nomeMusica: string
    interprete: string
    tomOriginal: string
    gruposDeMusicosId: number
    categoriasEmUso: {
        categoria: {
            id: number
            nome: string
        }
    }[]
}

export function CifrasPage() {
    const [cifras, setCifras] = useState<Cifra[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const [deletingId, setDeletingId] = useState<number | null>(null)

    const [filterCategories, setFilterCategories] = useState<number[]>([])
    const { categorias, loading: loadingCategories } = useCategorias()

    const { user } = useAuth()
    const isCoordenador = user?.role === ROLES.Coordenador

    const fetchCifras = async () => {
        try {
            setLoading(true)

            const categoriaQuery = filterCategories.length > 0
                ? `?categoriaIds=${filterCategories.join(',')}`
                : ''

            const response = await axios.get(`http://localhost:3000/cifras${categoriaQuery}`)

            setCifras(response.data)
        } catch (error) {
            console.error('Erro ao buscar cifras:', error)
            alert('Não foi possível carregar as cifras.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCifras()
    }, [filterCategories])

    const handleDeleteCifra = async (id: number, nomeMusica: string) => {
        if (!window.confirm(`Tem certeza que deseja EXCLUIR a cifra "${nomeMusica}"? Esta ação não pode ser desfeita.`)) {
            return
        }

        setDeletingId(id)

        try {
            await axios.delete(`http://localhost:3000/cifras/${id}`)

            fetchCifras()

        } catch (error) {
            console.error('Erro ao excluir cifra:', error)
            alert('Falha ao excluir a cifra. Verifique o console ou a sua permissão.')
        } finally {
            setDeletingId(null)
        }
    }

    const handleFilterChange = (categoryId: number) => {
        setFilterCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando cifras...</h1>
    }

    return (
        <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-3xl font-bold">Meu Acervo de Cifras</h1>

                {isCoordenador && (
                    <button
                        onClick={() => navigate('/cifras/nova')}
                        className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-white shadow transition-colors hover:bg-blue-700">
                        + Adicionar Nova Cifra
                    </button>
                )}
            </div>

            <div className="mb-6 rounded-lg bg-white p-4 shadow">
                <h2 className="mb-3 text-lg font-semibold">Filtro por Categoria:</h2>
                {loadingCategories ? (
                    <p className="text-gray-500">Carregando filtros...</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {categorias.length > 0 ? (
                            categorias.map((cat) => (
                                <label
                                    key={cat.id}
                                    className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors ${filterCategories.includes(cat.id)
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filterCategories.includes(cat.id)}
                                        onChange={() => handleFilterChange(cat.id)}
                                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    {cat.nome}
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">
                                Nenhuma categoria cadastrada.{' '}
                                {isCoordenador && (
                                    <Link to="/categorias" className="ml-1 text-blue-600 underline">
                                        Crie aqui.
                                    </Link>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <p>Carregando cifras...</p>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {cifras.length > 0 ? (
                        cifras.map((cifra) => (
                            <div
                                key={cifra.id}
                                className="flex flex-col justify-between rounded-lg bg-white p-5 shadow transition-shadow hover:shadow-md"
                            >
                                <div>
                                    <h3 className="truncate text-xl font-semibold text-gray-900" title={cifra.nomeMusica}>
                                        {cifra.nomeMusica}
                                    </h3>
                                    <p className="text-sm text-gray-600">{cifra.interprete}</p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {cifra.categoriasEmUso?.map(rel => (
                                            <span key={rel.categoria.id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                                                {rel.categoria.nome}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">

                                    <button
                                        onClick={() => navigate(`/cifras/${cifra.id}`)}
                                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                                    >
                                        Visualizar
                                    </button>

                                    {isCoordenador && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/cifras/${cifra.id}/editar`)}
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCifra(cifra.id, cifra.nomeMusica)}
                                                disabled={deletingId === cifra.id}
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deletingId === cifra.id ? '...' : 'Excluir'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3">
                            <p className="p-4 text-center text-gray-500">
                                Nenhuma cifra encontrada para este filtro.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}