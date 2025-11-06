import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategorias'

interface CifraData {
    nomeMusica: string
    interprete: string
    tomOriginal: string
    conteudoChordpro: string
}

interface CifraCategoria {
    categoriaId: number
}

export function CifraEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [nomeMusica, setNomeMusica] = useState('')
    const [interprete, setInterprete] = useState('')
    const [tomOriginal, setTomOriginal] = useState('')
    const [conteudoChordpro, setConteudoChordpro] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const { categorias, loading: loadingCategories } = useCategorias()

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    useEffect(() => {
        if (!id) return

        const fetchCifra = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get<CifraData & { categoriasEmUso: CifraCategoria[] }>(
                    `http://localhost:3000/cifras/${id}`,
                )

                setNomeMusica(response.data.nomeMusica)
                setInterprete(response.data.interprete)
                setTomOriginal(response.data.tomOriginal)
                setConteudoChordpro(response.data.conteudoChordpro)
                const categoriasIniciais = response.data.categoriasEmUso.map(
                    (relacao) => relacao.categoriaId
                )
                setSelectedCategories(categoriasIniciais)
            } catch (error) {
                console.error('Erro ao carregar dados da cifra:', error)
                alert('Cifra não encontrada ou você não tem permissão para editar.')
                navigate('/cifras')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCifra()
    }, [id, navigate])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (isSaving || isLoading) return

        setIsSaving(true)

        const dtoAtualizado = {
            nomeMusica,
            interprete,
            tomOriginal,
            conteudoChordpro,
            categoriaIds: selectedCategories
        }

        try {
            await axios.patch(`http://localhost:3000/cifras/${id}`, dtoAtualizado)

            alert('Cifra atualizada com sucesso!')
            navigate('/cifras')

        } catch (error) {
            console.error('Erro ao atualizar cifra:', error)
            alert('Falha ao atualizar a cifra. Verifique o console.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <h1 className="text-2xl font-bold">Carregando dados para edição...</h1>
    }
    if (!id) {
        return <h1 className="text-2xl font-bold">ID da cifra não fornecido.</h1>
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Editar Cifra</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-lg"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <label htmlFor="nomeMusica" className="mb-2 block text-sm font-medium text-gray-700">Nome da Música</label>
                        <input
                            id="nomeMusica"
                            type="text"
                            value={nomeMusica}
                            onChange={(e) => setNomeMusica(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Aumentei o padding
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="interprete" className="mb-2 block text-sm font-medium text-gray-700">Intérprete</label>
                        <input
                            id="interprete"
                            type="text"
                            value={interprete}
                            onChange={(e) => setInterprete(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Aumentei o padding
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="tomOriginal" className="mb-2 block text-sm font-medium text-gray-700">Tom Original</label>
                        <input
                            id="tomOriginal"
                            type="text"
                            value={tomOriginal}
                            onChange={(e) => setTomOriginal(e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" // Aumentei o padding
                            required
                        />
                    </div>
                </div>

                <div className="mb-0">
                    <h3 className="mb-2 text-lg font-medium">Categorias (Tags)</h3>
                    {(loadingCategories || isLoading) ? (
                        <p className="text-gray-500">Carregando categorias...</p>
                    ) : (
                        <div className="flex flex-wrap gap-4 rounded-md border border-gray-300 p-4">
                            {categorias.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryChange(cat.id)}
                                        className="form-checkbox h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    {cat.nome}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="conteudoChordpro" className="mb-2 block text-sm font-medium text-gray-700">Cifra (formato ChordPro)</label>
                    <textarea
                        id="conteudoChordpro"
                        value={conteudoChordpro}
                        onChange={(e) => setConteudoChordpro(e.target.value)}
                        className="w-full rounded-md border-gray-300 bg-gray-50 p-4 font-mono text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={15}
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/cifras')}
                        className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || isLoading}
                        className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-green-700 disabled:opacity-50" // Mudei para verde!
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    )
}