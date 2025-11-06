import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Comunidade {
    id: number
    nome: string
}
interface Paroquia {
    id: number
    nome: string
    comunidade: { nome: string }
}
interface Igreja {
    id: number
    nome: string
    tipo: string
    paroquia: { nome: string }
}

type Tab = 'comunidades' | 'paroquias' | 'igrejas'

export function AdminOrganizationPage() {
    const [comunidades, setComunidades] = useState<Comunidade[]>([])
    const [paroquias, setParoquias] = useState<Paroquia[]>([])
    const [igrejas, setIgrejas] = useState<Igreja[]>([])
    const [loading, setLoading] = useState(true)

    const [formComunidade, setFormComunidade] = useState('')
    const [formParoquia, setFormParoquia] = useState({ nome: '', comunidadeId: '' })
    const [formIgreja, setFormIgreja] = useState({ nome: '', tipo: 'Matriz', paroquiaId: '' })

    const [activeTab, setActiveTab] = useState<Tab>('comunidades')

    const fetchData = async () => {
        try {
            setLoading(true)

            const [comunResponse, paroqResponse, igrResponse] = await Promise.all([
                axios.get('http://localhost:3000/admin/comunidades'),
                axios.get('http://localhost:3000/admin/paroquias'),
                axios.get('http://localhost:3000/admin/igrejas'),
            ])
            setComunidades(comunResponse.data)
            setParoquias(paroqResponse.data)
            setIgrejas(igrResponse.data)
        } catch (error) {
            console.error('Erro ao buscar dados da organização:', error)
            alert('Falha ao carregar dados. Você é um Admin?')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateComunidade = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/organizacao/comunidade', { nome: formComunidade })
            setFormComunidade('')
            fetchData()
        } catch (error) { alert('Erro ao criar comunidade.') }
    }

    const handleCreateParoquia = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/organizacao/paroquia', {
                nome: formParoquia.nome,
                comunidadeId: parseInt(formParoquia.comunidadeId),
            })
            setFormParoquia({ nome: '', comunidadeId: '' })
            fetchData()
        } catch (error) { alert('Erro ao criar paróquia.') }
    }

    const handleCreateIgreja = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/organizacao/igreja', {
                nome: formIgreja.nome,
                tipo: formIgreja.tipo,
                paroquiaId: parseInt(formIgreja.paroquiaId),
            })
            setFormIgreja({ nome: '', tipo: 'Matriz', paroquiaId: '' })
            fetchData()
        } catch (error) { alert('Erro ao criar igreja.') }
    }

    if (loading && comunidades.length === 0) {
        return <h1 className="text-2xl font-bold">Carregando Organização...</h1>
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Gerenciamento da Organização</h1>

            <div className="mb-6 flex border-b border-gray-300">
                <TabButton
                    label="Comunidades"
                    isActive={activeTab === 'comunidades'}
                    onClick={() => setActiveTab('comunidades')}
                />
                <TabButton
                    label="Paróquias"
                    isActive={activeTab === 'paroquias'}
                    onClick={() => setActiveTab('paroquias')}
                />
                <TabButton
                    label="Igrejas"
                    isActive={activeTab === 'igrejas'}
                    onClick={() => setActiveTab('igrejas')}
                />
            </div>

            <div className={activeTab === 'comunidades' ? '' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <form onSubmit={handleCreateComunidade} className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Nova Comunidade</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nome da Comunidade"
                                value={formComunidade}
                                onChange={(e) => setFormComunidade(e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm"
                                required
                            />
                            <button type="submit" className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700">+</button>
                        </div>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Comunidades ({comunidades.length})</h2>
                        <ul className="h-64 divide-y overflow-y-auto">
                            {comunidades.map(c => <li key={c.id} className="py-2">{c.nome} (ID: {c.id})</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={activeTab === 'paroquias' ? '' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <form onSubmit={handleCreateParoquia} className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Nova Paróquia</h2>
                        <input
                            type="text"
                            placeholder="Nome da Paróquia"
                            value={formParoquia.nome}
                            onChange={(e) => setFormParoquia(prev => ({ ...prev, nome: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm"
                            required
                        />
                        <select
                            value={formParoquia.comunidadeId}
                            onChange={(e) => setFormParoquia(prev => ({ ...prev, comunidadeId: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="">Selecione a Comunidade...</option>
                            {comunidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                        <button type="submit" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">Criar Paróquia</button>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Paróquias ({paroquias.length})</h2>
                        <ul className="h-64 divide-y overflow-y-auto">
                            {paroquias.map(p => <li key={p.id} className="py-2">{p.nome} <span className="text-xs text-gray-500">[{p.comunidade.nome}]</span></li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={activeTab === 'igrejas' ? '' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <form onSubmit={handleCreateIgreja} className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Nova Igreja</h2>
                        <input
                            type="text"
                            placeholder="Nome da Igreja"
                            value={formIgreja.nome}
                            onChange={(e) => setFormIgreja(prev => ({ ...prev, nome: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm"
                            required
                        />
                        <select
                            value={formIgreja.paroquiaId}
                            onChange={(e) => setFormIgreja(prev => ({ ...prev, paroquiaId: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="">Selecione a Paróquia...</option>
                            {paroquias.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                        <select
                            value={formIgreja.tipo}
                            onChange={(e) => setFormIgreja(prev => ({ ...prev, tipo: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="Matriz">Matriz</option>
                            <option value="Capela">Capela</option>
                        </select>
                        <button type="submit" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">Criar Igreja</button>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Igrejas ({igrejas.length})</h2>
                        <ul className="h-64 divide-y overflow-y-auto">
                            {igrejas.map(i => <li key={i.id} className="py-2">{i.nome} <span className="text-xs text-gray-500">[{i.paroquia.nome}]</span></li>)}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

interface TabButtonProps {
    label: string
    isActive: boolean
    onClick: () => void
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 text-lg font-medium transition-colors
        ${isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }
      `}
        >
            {label}
        </button>
    )
}