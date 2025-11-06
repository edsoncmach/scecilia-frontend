import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email: email,
                senha: senha,
            })

            const accessToken = response.data.accessToken

            login(accessToken)

            navigate('/')

        } catch (error) {
            console.error('Erro ao fazer login:', error)
            alert('Email ou senha inválidos!')
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    S. Cecília
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            Senha
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
                        className="mt-4 w-full rounded-lg bg-blue-600 p-3 text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Ainda não tem uma conta?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    )
}