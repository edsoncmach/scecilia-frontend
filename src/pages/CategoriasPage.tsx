import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Categoria {
    id: number
    nome: string
}

export function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [novaCategoriaNome, setNovaCategoriaNome] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchCategorias = async () => {
        try {
            setLoading(true)

            const response = await axios.get('http://localhost:3000/categorias')
            setCategorias(response.data)
        } catch (error) {
            console.error('Erro ao buscar categorias:', error)
            alert('Não foi possível carregar as categorias.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategorias()
    }, [])

    const handleCreateCategoria = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!novaCategoriaNome || isSaving) return
        setIsSaving(true)

        try {
            await axios.post('http://localhost:3000/categorias', {
                nome: novaCategoriaNome,
            })

            setNovaCategoriaNome('')
            fetchCategorias()
        } catch (error: any) {
            console.error('Erro ao criar categoria:', error)
            const msg = error.response?.data?.message || 'Erro desconhecido.'
            alert(`Falha ao criar: ${msg}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteCategoria = async (id: number, nome: string) => {
        if (!window.confirm(`Tem certeza que deseja EXCLUIR a categoria "${nome}"?`)) {
            return
        }

        setDeletingId(id)

        try {
            await axios.delete(`http://localhost:3000/categorias/${id}`)
            fetchCategorias()
        } catch (error) {
            console.error('Erro ao excluir:', error)
            alert('Falha ao excluir categoria.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Gerenciar Categorias</h1>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Nova Categoria</h2>
                        <form onSubmit={handleCreateCategoria} className="flex gap-2">
                            <input
                                type="text"
                                value={novaCategoriaNome}
                                onChange={(e) => setNovaCategoriaNome(e.target.value)}
                                className="flex-1 rounded-md border-gray-300 p-2 shadow-sm"
                                placeholder="Ex: Quaresma, Entrada, Louvor..."
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSaving ? 'Salvando...' : 'Criar'}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-lg bg-white shadow">
                        <h2 className="border-b p-4 text-xl font-semibold">Minhas Categorias ({categorias.length})</h2>
                        <ul className="divide-y divide-gray-200">
                            {categorias.length > 0 ? (
                                categorias.map((cat) => (
                                    <li key={cat.id} className="flex items-center justify-between p-4">
                                        <p className="font-medium text-gray-900">{cat.nome}</p>
                                        <button
                                            onClick={() => handleDeleteCategoria(cat.id, cat.nome)}
                                            disabled={deletingId === cat.id}
                                            className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white shadow hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {deletingId === cat.id ? '...' : 'Excluir'}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="p-4 text-center text-gray-500">Nenhuma categoria cadastrada.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}