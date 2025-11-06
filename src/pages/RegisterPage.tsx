import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export function RegisterPage() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            await axios.post('http://localhost:3000/auth/register', {
                nome,
                email,
                senha
            })

            alert('Cadastro realizado com sucesso! Faça o login para continuar.')
            navigate('/login')

        } catch (error: any) {
            console.error('Erro ao cadastrar:', error)
            const msg = error.response?.data?.message || 'Erro desconhecido.'
            alert(`Falha no cadastro: ${msg}`)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Criar Conta
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div>
                        <label
                            htmlFor="nome"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Nome Completo
                        </label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Seu nome"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="voce@paroquia.com"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="senha"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Senha (mínimo 6 caracteres)
                        </label>
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full rounded-lg bg-blue-600 p-3 text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Faça o login
                    </Link>
                </p>
            </div>
        </div>
    )
}