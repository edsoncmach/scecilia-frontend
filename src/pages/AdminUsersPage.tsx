import { useState, useEffect } from 'react'
import axios from 'axios'
import { ROLES, type Role } from '../auth/role.definition'

interface Igreja {
    id: number
    nome: string
}
interface UsuarioAdminView {
    id: number
    email: string
    nome: string
    role: Role
    igrejaGerenciada: Igreja | null
}

export function AdminUsersPage() {
    const [usuarios, setUsuarios] = useState<UsuarioAdminView[]>([])
    const [loading, setLoading] = useState(true)

    const [todasIgrejas, setTodasIgrejas] = useState<Igreja[]>([])

    const [editingUser, setEditingUser] = useState<UsuarioAdminView | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)

            const usersPromise = axios.get('http://localhost:3000/admin/usuarios')
            const igrejasPromise = axios.get('http://localhost:3000/admin/igrejas')
            const [usersResponse, igrejasResponse] = await Promise.all([
                usersPromise,
                igrejasPromise,
            ])

            setUsuarios(usersResponse.data)
            setTodasIgrejas(igrejasResponse.data)
        } catch (error) {
            console.error('Erro ao buscar dados de admin:', error)
            alert('Você não tem permissão ou a API falhou.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handlePromote = (usuario: UsuarioAdminView) => {
        setEditingUser({ ...usuario })
    }

    const handleCancelEdit = () => {
        setEditingUser(null)
    }

    const handleSaveEdit = async () => {
        if (!editingUser) return

        const dto = {
            role: editingUser.role,
            igrejaGerenciadaId: editingUser.role === ROLES.Coordenador ? editingUser.igrejaGerenciada?.id : null
        }

        if (dto.role === ROLES.Coordenador && !dto.igrejaGerenciadaId) {
            alert('Para promover a Coordenador, você DEVE selecionar uma igreja.')
            return
        }

        try {
            await axios.patch(`http://localhost:3000/admin/usuarios/${editingUser.id}`, dto)
            alert('Usuário atualizado com sucesso!')
            setEditingUser(null)
            fetchData()
        } catch (error) {
            console.error('Erro ao salvar:', error)
            alert('Falha ao salvar. Verifique o console.')
        }
    }

    if (loading) {
        return <h1 className="text-2xl font-bold">Carregando Painel Admin...</h1>
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Gerenciamento de Usuários</h1>

            <div className="rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cargo Atual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Igreja Gerenciada</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {usuarios.map((user) => (
                            <tr key={user.id}>

                                {editingUser?.id !== user.id && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.igrejaGerenciada?.nome || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handlePromote(user)} className="text-blue-600 hover:text-blue-900">
                                                Gerenciar
                                            </button>
                                        </td>
                                    </>
                                )}

                                {editingUser?.id === user.id && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{editingUser.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{editingUser.email}</td>
                                        {/* Select de Cargo */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                                                className="rounded-md border-gray-300"
                                            >
                                                <option value={ROLES.Admin}>Admin</option>
                                                <option value={ROLES.Coordenador}>Coordenador</option>
                                                <option value={ROLES.Musico}>Músico</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingUser.role === ROLES.Coordenador && (
                                                <select
                                                    value={editingUser.igrejaGerenciada?.id || ''}
                                                    onChange={(e) => setEditingUser({ ...editingUser, igrejaGerenciada: { id: parseInt(e.target.value), nome: '' } })}
                                                    className="rounded-md border-gray-300"
                                                >
                                                    <option value="">Selecione uma igreja...</option>
                                                    {todasIgrejas.map(igreja => (
                                                        <option key={igreja.id} value={igreja.id}>{igreja.nome}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {editingUser.role !== ROLES.Coordenador && 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-900">Salvar</button>
                                            <button onClick={handleCancelEdit} className="ml-4 text-red-600 hover:text-red-900">Cancelar</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}