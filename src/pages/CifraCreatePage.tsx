import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategorias'

export function CifraCreatePage() {
    const [nomeMusica, setNomeMusica] = useState('')
    const [interprete, setInterprete] = useState('')
    const [tomOriginal, setTomOriginal] = useState('')

    const [conteudoRaw, setConteudoRaw] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const { categorias, loading: loadingCategories } = useCategorias()

    const navigate = useNavigate()

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        )
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (isLoading) return
        setIsLoading(true)

        const novaCifraDto = {
            nomeMusica,
            interprete,
            tomOriginal,
            conteudoChordpro: conteudoRaw,
            categoriaIds: selectedCategories,
        }

        try {
            await axios.post('http://localhost:3000/cifras', novaCifraDto)

            alert('Cifra salva com sucesso!')
            navigate('/cifras')

        } catch (error: any) {
            console.error('Erro ao salvar cifra:', error)
            alert(`Falha ao salvar a cifra: ${error.response?.data?.message || 'Erro desconhecido.'}`)
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Adicionar Nova Cifra</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-lg"
            >

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                    <div>
                        <label htmlFor="nomeMusica" className="mb-2 block text-sm font-medium text-gray-700">Nome da Música</label>
                        <input id="nomeMusica" type="text" value={nomeMusica} onChange={(e) => setNomeMusica(e.target.value)} className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="interprete" className="mb-2 block text-sm font-medium text-gray-700">Intérprete</label>
                        <input id="interprete" type="text" value={interprete} onChange={(e) => setInterprete(e.target.value)} className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="tomOriginal" className="mb-2 block text-sm font-medium text-gray-700">Tom Original</label>
                        <input id="tomOriginal" type="text" value={tomOriginal} onChange={(e) => setTomOriginal(e.target.value)} className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                </div>

                <div className="mb-0">
                    <h3 className="mb-2 text-lg font-medium">Categorias (Tags)</h3>
                    {loadingCategories ? (
                        <p className="text-gray-500">Carregando categorias...</p>
                    ) : (
                        <div className="flex flex-wrap gap-4 rounded-md border border-gray-300 p-4">
                            {categorias.length === 0 ? (
                                <p className="text-sm text-gray-600">Nenhuma categoria cadastrada.{' '}<Link to="/categorias" className="ml-1 text-blue-600 underline">Crie aqui.</Link></p>
                            ) : (
                                categorias.map((cat) => (
                                    <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200">
                                        <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => handleCategoryChange(cat.id)} className="form-checkbox h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                                        {cat.nome}
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="conteudoRaw"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Cifra (Formato CifraClub - Cifra em cima, letra embaixo)
                    </label>
                    <textarea
                        id="conteudoRaw"
                        value={conteudoRaw}
                        onChange={(e) => setConteudoRaw(e.target.value)}
                        className="w-full rounded-md border-gray-300 bg-gray-50 p-4 font-mono text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={20}
                        placeholder="    G         C
Minha terra tem palmeiras..."
                        required
                        spellCheck="false"
                    />
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">

                    <button type="button" onClick={() => navigate('/cifras')} className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isLoading} className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-700 disabled:opacity-50">
                        {isLoading ? 'Salvando...' : 'Salvar Cifra'}
                    </button>
                </div>
            </form>
        </div>
    )
}