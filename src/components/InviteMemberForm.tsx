import React, { useState } from 'react'
import axios from 'axios'
import { ROLES, type Role } from '../auth/role.definition'

interface InviteMemberFormProps {
    groupId: number
    grupoNome: string
}

export function InviteMemberForm({ groupId, grupoNome }: InviteMemberFormProps) {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<Role>(ROLES.Musico)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setMessage(null)
        setIsLoading(true)

        try {
            const url = `http://localhost:3000/organizacao/grupo/${groupId}/membros`

            const response = await axios.post(url, { email, role })

            setMessage(`Sucesso: ${response.data.message}`)
            setEmail('')

        } catch (error: any) {
            console.error('Erro ao convidar usuário:', error)
            const msg = error.response?.data?.message || 'Falha na conexão ou usuário não cadastrado.'
            setMessage(`Erro: ${msg}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
                Convidar Novo Membro para: <span className="text-blue-600">{grupoNome}</span>
            </h3>

            {message && (
                <p className={`mb-4 rounded-md p-3 text-sm ${message.startsWith('Sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">Email do Músico (Precisa de cadastro)</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border-gray-300 p-2 shadow-sm"
                        required
                        placeholder="musico@exemplo.com"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="mb-1 block text-sm font-medium">Cargo no Grupo</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full rounded-md border-gray-300 p-2 shadow-sm"
                    >
                        <option value={ROLES.Musico}>Músico (Padrão)</option>
                        <option value={ROLES.Coordenador}>Coordenador (Acesso Total)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-blue-600 p-2 text-white shadow transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Enviando Convite...' : 'Adicionar ao Grupo'}
                </button>
            </form>
        </div>
    )
}