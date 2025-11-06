import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { InviteMemberForm } from '../components/InviteMemberForm'
import { ROLES } from '../auth/role.definition'

interface Grupo {
    id: number
    nome: string
}

interface Membro {
    usuario: {
        id: number
        nome: string
        email: string
        role: string
    }
}

export function GrupoManagementPage() {
    const { user } = useAuth()

    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [loadingGrupos, setLoadingGrupos] = useState(true)
    const [novoGrupoNome, setNovoGrupoNome] = useState('')

    const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null)
    const [membros, setMembros] = useState<Membro[]>([])
    const [loadingMembros, setLoadingMembros] = useState(false)

    const igrejaId = user?.igrejaGerenciadaId

    const fetchMembros = useCallback(async (grupoId: number) => {
        try {
            setLoadingMembros(true)
            const response = await axios.get(
                `http://localhost:3000/organizacao/grupo/${grupoId}/membros`,
            )
            setMembros(response.data)
        } catch (error) {
            console.error('Erro ao buscar membros:', error)
            setMembros([])
        } finally {
            setLoadingMembros(false)
        }
    }, [])

    const handleSelectGrupo = useCallback((grupo: Grupo) => {
        setSelectedGrupo(grupo)
        fetchMembros(grupo.id)
    }, [fetchMembros])

    const fetchGrupos = useCallback(async (selecionarPrimeiro: boolean = false) => {
        if (!igrejaId) return

        try {
            setLoadingGrupos(true)

            const response = await axios.get(
                `http://localhost:3000/organizacao/igreja/${igrejaId}/grupos`,
            )
            setGrupos(response.data)

            if (selecionarPrimeiro && response.data.length > 0) {
                handleSelectGrupo(response.data[0])
            }
        } catch (error) {
            console.error('Erro ao buscar grupos:', error)
        } finally {
            setLoadingGrupos(false)
        }
    }, [igrejaId, handleSelectGrupo])

    useEffect(() => {
        fetchGrupos(true)
    }, [fetchGrupos])

    const handleCreateGrupo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!igrejaId || !novoGrupoNome) return
        try {
            await axios.post('http://localhost:3000/organizacao/grupo', {
                nome: novoGrupoNome,
                igrejaId: igrejaId,
            })
            setNovoGrupoNome('')
            fetchGrupos() // Recarrega a lista de grupos
        } catch (error) { alert('Falha ao criar grupo.') }
    }

    const handleRemoveMember = async (userId: number, userName: string) => {
        if (!selectedGrupo) return
        if (!window.confirm(`Tem certeza que deseja remover "${userName}" do grupo "${selectedGrupo.nome}"?`)) return

        try {
            await axios.delete(
                `http://localhost:3000/organizacao/grupo/${selectedGrupo.id}/membros/${userId}`,
            )
            alert('Membro removido.')
            fetchMembros(selectedGrupo.id) // Recarrega a lista de membros
        } catch (error: any) {
            alert(`Erro: ${error.response?.data?.message || 'Falha ao remover.'}`)
        }
    }

    if (!igrejaId || user?.role !== ROLES.Coordenador) {
        return <h1 className="text-2xl font-bold text-red-600">Acesso Negado.</h1>
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Gerenciar Meus Grupos</h1>
            <p className="mb-6 text-lg text-gray-600">
                Você está gerenciando a <span className="font-semibold">{user.contexto?.igrejaNome || 'Igreja'}</span>.
            </p>

            {/* --- Seção 1: Criação de Grupo --- */}
            <div className="rounded-lg bg-white p-6 shadow mb-8">
                <h2 className="mb-4 text-xl font-semibold">Criar Novo Grupo</h2>
                <form onSubmit={handleCreateGrupo} className="flex gap-2">
                    <input
                        type="text"
                        value={novoGrupoNome}
                        onChange={(e) => setNovoGrupoNome(e.target.value)}
                        className="flex-1 rounded-md border-gray-300 p-2 shadow-sm"
                        placeholder="Ex: Ministério Kairós"
                        required
                    />
                    <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
                        Criar
                    </button>
                </form>
            </div>

            {/* --- Seção 2: Gerenciamento (Layout de 2 Colunas) --- */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                {/* Coluna 1: Lista de Grupos (Clicável) */}
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Meus Grupos</h2>
                    <div className="rounded-lg bg-white shadow">
                        {loadingGrupos ? <p className="p-4">Carregando...</p> : (
                            <ul className="divide-y divide-gray-200">
                                {grupos.length > 0 ? grupos.map(g => (
                                    <li
                                        key={g.id}
                                        onClick={() => handleSelectGrupo(g)}
                                        className={`cursor-pointer p-4 font-medium transition-colors hover:bg-gray-100 ${selectedGrupo?.id === g.id ? 'bg-blue-100 text-blue-800' : ''}`}
                                    >
                                        {g.nome}
                                    </li>
                                )) : <p className="p-4 text-gray-500">Nenhum grupo criado.</p>}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Detalhes do Grupo Selecionado (Membros e Convites) */}
                <div className="md:col-span-2">
                    {!selectedGrupo ? (
                        <div className="rounded-lg bg-white p-6 text-center shadow">
                            <p className="text-gray-500">Selecione um grupo ao lado para gerenciar.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* O Formulário de Convite (agora dinâmico) */}
                            <InviteMemberForm
                                groupId={selectedGrupo.id}
                                grupoNome={selectedGrupo.nome}
                                key={selectedGrupo.id} // Força o componente a resetar quando o grupo muda
                            />

                            {/* A Lista de Membros */}
                            <div className="rounded-lg bg-white shadow">
                                <h2 className="border-b p-4 text-xl font-semibold">Membros de "{selectedGrupo.nome}"</h2>
                                {loadingMembros ? <p className="p-4">Carregando membros...</p> : (
                                    <ul className="divide-y divide-gray-200">
                                        {membros.length > 0 ? membros.map(m => (
                                            <li key={m.usuario.id} className="flex items-center justify-between p-4">
                                                <div>
                                                    <p className="font-medium">{m.usuario.nome} {m.usuario.role === ROLES.Coordenador && ' (Coord.)'}</p>
                                                    <p className="text-sm text-gray-500">{m.usuario.email}</p>
                                                </div>
                                                {/* Não pode remover a si mesmo */}
                                                {user.id !== m.usuario.id && (
                                                    <button
                                                        onClick={() => handleRemoveMember(m.usuario.id, m.usuario.nome)}
                                                        className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                    >
                                                        Remover
                                                    </button>
                                                )}
                                            </li>
                                        )) : <p className="p-4 text-gray-500">Nenhum membro neste grupo.</p>}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}