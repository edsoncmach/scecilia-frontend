import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategorias'
import { FaSearch } from 'react-icons/fa'

interface CifraAcervo {
    id: number
    nomeMusica: string
    interprete: string
}

interface CifraSetlist {
    cifraId: number
    nomeMusica: string
    interprete: string
    tomExecucao: string
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export function CelebracaoEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [celebracaoNome, setCelebracaoNome] = useState('')
    const [setlist, setSetlist] = useState<CifraSetlist[]>([])

    const [acervo, setAcervo] = useState<CifraAcervo[]>([])
    const [loadingAcervo, setLoadingAcervo] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategorias, setFilterCategorias] = useState<number[]>([])

    const { categorias, loading: loadingCategories } = useCategorias()
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        if (!id) return
        const fetchSetlistInicial = async () => {
            try {
                setLoading(true)
                const celebracaoResponse = await axios.get(
                    `http://localhost:3000/celebracoes/${id}`,
                )
                setCelebracaoNome(
                    celebracaoResponse.data.tituloOpcional ||
                    celebracaoResponse.data.tipoCelebracao.nome,
                )
                const setlistInicial = celebracaoResponse.data.cifras.map((item: any) => ({
                    cifraId: item.cifra.id,
                    nomeMusica: item.cifra.nomeMusica,
                    interprete: item.cifra.interprete,
                    tomExecucao: item.tomExecucao,
                }))
                setSetlist(setlistInicial)
            } catch (error) {
                alert('Falha ao carregar dados da celebração.')
            } finally {
                setLoading(false)
            }
        }
        fetchSetlistInicial()
    }, [id])

    useEffect(() => {
        const fetchAcervo = async () => {
            if (!debouncedSearchTerm && filterCategorias.length === 0) {
                setAcervo([])
                return
            }

            try {
                setLoadingAcervo(true)
                const params = new URLSearchParams()
                if (debouncedSearchTerm) {
                    params.append('search', debouncedSearchTerm)
                }
                if (filterCategorias.length > 0) {
                    params.append('categoriaIds', filterCategorias.join(','))
                }

                const response = await axios.get(
                    `http://localhost:3000/cifras?${params.toString()}`,
                )
                setAcervo(response.data)
            } catch (error) {
                console.error('Erro ao buscar acervo:', error)
            } finally {
                setLoadingAcervo(false)
            }
        }

        fetchAcervo()
    }, [debouncedSearchTerm, filterCategorias])

    const handleAdd = (cifra: CifraAcervo) => {
        if (setlist.find((item) => item.cifraId === cifra.id)) return
        const novoItem: CifraSetlist = {
            cifraId: cifra.id,
            nomeMusica: cifra.nomeMusica,
            interprete: cifra.interprete,
            tomExecucao: 'G', // Tom padrão
        }
        setSetlist([...setlist, novoItem])
    }
    const handleRemove = (cifraId: number) => {
        setSetlist(setlist.filter((item) => item.cifraId !== cifraId))
    }
    const handleTomChange = (cifraId: number, novoTom: string) => {
        setSetlist(
            setlist.map((item) =>
                item.cifraId === cifraId ? { ...item, tomExecucao: novoTom } : item,
            ),
        )
    }
    const handleFilterChange = (categoryId: number) => {
        setFilterCategorias((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        )
    }

    const handleSubmit = async () => {
        setLoading(true)

        const dtoParaEnviar = {
            cifras: setlist.map((item, index) => ({
                cifraId: item.cifraId,
                tomExecucao: item.tomExecucao,
                ordem: index + 1,
            })),
        }

        try {
            await axios.post(
                `http://localhost:3000/celebracoes/${id}/setlist`,
                dtoParaEnviar,
            )
            alert('Setlist salvo com sucesso!')
            navigate(`/celebracoes/${id}`)
        } catch (error) {
            console.error('Erro ao salvar setlist:', error)
            alert('Falha ao salvar. Verifique o console.')
            setLoading(false)
        }
    }

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando editor...</h1>
    }

    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold">
                Montar Setlist: <span className="text-blue-600">{celebracaoNome}</span>
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div className="flex flex-col rounded-lg bg-white shadow">
                    <h2 className="border-b p-4 text-xl font-semibold">Acervo do Grupo</h2>

                    <div className="relative border-b p-4">
                        <input
                            type="search"
                            placeholder="Buscar por nome ou intérprete..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-2 pl-10 shadow-sm"
                        />
                        <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="border-b p-4">
                        <h3 className="mb-2 text-sm font-medium">Filtrar por Categoria:</h3>
                        {loadingCategories ? <p className="text-xs">...</p> : (
                            <div className="flex flex-wrap gap-2">
                                {categorias.map((cat) => (
                                    <label key={cat.id} className="flex cursor-pointer items-center gap-1">
                                        <input
                                            type="checkbox"
                                            checked={filterCategorias.includes(cat.id)}
                                            onChange={() => handleFilterChange(cat.id)}
                                            className="h-4 w-4 rounded text-blue-600"
                                        />
                                        <span className="text-sm">{cat.nome}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <ul className="divide-y divide-gray-200 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                        {loadingAcervo && <p className="p-3 text-center text-gray-500">Buscando...</p>}
                        {!loadingAcervo && acervo.length === 0 && (
                            <p className="p-3 text-center text-gray-500">
                                {searchTerm || filterCategorias.length > 0 ? 'Nenhum resultado.' : 'Digite acima para buscar no acervo.'}
                            </p>
                        )}
                        {!loadingAcervo && acervo.map((cifra) => (
                            <li key={cifra.id} className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-medium">{cifra.nomeMusica}</p>
                                    <p className="text-sm text-gray-500">{cifra.interprete}</p>
                                </div>
                                <button
                                    onClick={() => handleAdd(cifra)}
                                    className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                                >
                                    Adicionar &rarr;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="rounded-lg bg-white shadow">
                        <h2 className="border-b p-4 text-xl font-semibold">Setlist</h2>
                        <ul className="divide-y divide-gray-200 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                            {setlist.length > 0 ? setlist.map((item) => (
                                <li key={item.cifraId} className="flex items-center justify-between p-3">
                                    <button
                                        onClick={() => handleRemove(item.cifraId)}
                                        className="mr-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                    >
                                        &larr;
                                    </button>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.nomeMusica}</p>
                                        <p className="text-sm text-gray-500">{item.interprete}</p>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.tomExecucao}
                                        onChange={(e) => handleTomChange(item.cifraId, e.target.value)}
                                        className="w-20 rounded border-gray-300 p-1 text-center shadow-sm"
                                        placeholder="Tom"
                                    />
                                </li>
                            )) : (
                                <p className="p-4 text-center text-gray-500">Adicione cifras do acervo.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4 rounded-lg bg-white p-4 shadow">
                <div className="mt-6 flex justify-end gap-4 rounded-lg bg-white p-4 shadow">
                    <button
                        onClick={() => navigate(`/celebracoes/${id}`)}
                        className="rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Setlist'}
                    </button>
                </div>
            </div>
        </div>
    )
}