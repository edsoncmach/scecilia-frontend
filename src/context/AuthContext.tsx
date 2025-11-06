import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { type Role } from '../auth/role.definition'

interface UsuarioComContexto {
    id: number
    nome: string
    email: string
    role: Role
    igrejaGerenciadaId?: number | null
    contexto: {
        role: string
        grupoId: number
        grupoNome: string
        igrejaId: number
        igrejaNome: string
        paroquiaId: number
        paroquiaNome: string
    }
}

interface AuthContextData {
    user: UsuarioComContexto | null
    isLoading: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UsuarioComContexto | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchProfile = async (token: string) => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

            const response = await axios.get('http://localhost:3000/auth/profile')

            setUser(response.data.usuario)
            return true

        } catch (error) {
            console.error('Token inválido ou sessão expirou.', error)
            return false
        }
    }

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('@Scecelia:token')

            if (storedToken) {
                const ok = await fetchProfile(storedToken)
                if (!ok) {
                    localStorage.removeItem('@Scecelia:token')
                    delete axios.defaults.headers.common['Authorization']
                }
            }
            setIsLoading(false)
        }
        loadUser()
    }, [])

    const login = async (newToken: string) => {
        localStorage.setItem('@Scecelia:token', newToken)
        await fetchProfile(newToken)
    }

    const logout = () => {
        localStorage.removeItem('@Scecelia:token')
        delete axios.defaults.headers.common['Authorization']
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}