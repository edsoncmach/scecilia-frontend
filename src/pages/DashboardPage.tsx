import { useAuth } from '../context/AuthContext'
import { ROLES } from '../auth/role.definition'
import { Link } from 'react-router-dom'
import { FaUserShield, FaSitemap, FaUsers, FaMusic, FaCalendarAlt } from 'react-icons/fa'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AdminDashboard: React.FC = () => {
	const [stats, setStats] = useState({ usuarios: 0, paroquias: 0, igrejas: 0, grupos: 0, cifras: 0 })

	useEffect(() => {
		axios.get('http://localhost:3000/admin/stats')
			.then(response => setStats(response.data))
			.catch(err => console.error("Falha ao buscar stats de admin", err))
	}, [])

	return (
		<>
			<h2 className="mb-6 text-2xl font-semibold">Painel do Administrador</h2>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<StatCard val={stats.usuarios} label="Usuários" />
				<StatCard val={stats.paroquias} label="Paróquias" />
				<StatCard val={stats.igrejas} label="Igrejas" />
				<StatCard val={stats.grupos} label="Grupos" />
			</div>

			<div className="mt-8">
				<h3 className="mb-4 text-xl font-semibold">Ações Rápidas</h3>
				<div className="flex flex-wrap gap-4">
					<ShortcutButton to="/admin/organizacao" icon={<FaSitemap />} label="Gerenciar Organização" />
					<ShortcutButton to="/admin/usuarios" icon={<FaUserShield />} label="Gerenciar Usuários" />
				</div>
			</div>
		</>
	)
}

const CoordenadorDashboard: React.FC = () => {
	
	return (
		<>
			<h2 className="mb-6 text-2xl font-semibold">Painel do Coordenador</h2>

			<div className="mt-8">
				<h3 className="mb-4 text-xl font-semibold">Ações Rápidas</h3>
				<div className="flex flex-wrap gap-4">
					<ShortcutButton to="/cifras/nova" icon={<FaMusic />} label="Adicionar Cifra" />
					<ShortcutButton to="/celebracoes/nova" icon={<FaCalendarAlt />} label="Agendar Celebração" />
					<ShortcutButton to="/gerenciar-grupos" icon={<FaUsers />} label="Gerenciar Grupos" />
				</div>
			</div>
		</>
	)
}

const MusicoDashboard: React.FC = () => {

	return (
		<>
			<h2 className="mb-6 text-2xl font-semibold">Painel do Músico</h2>
			<div className="mt-8 rounded-lg bg-white p-6 shadow">
				<h3 className="mb-4 text-xl font-semibold">Próxima Celebração</h3>
				<p className="text-gray-600">(Em breve: Sua próxima missa aparecerá aqui)</p>
				<Link to="/celebracoes">
					<button className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700">
						Ver todas as celebrações
					</button>
				</Link>
			</div>
		</>
	)
}

const StatCard = ({ val, label }: { val: number; label: string }) => (
	<div className="rounded-lg bg-white p-4 text-center shadow">
		<div className="text-3xl font-bold text-blue-600">{val}</div>
		<div className="text-sm font-medium text-gray-500">{label}</div>
	</div>
)

const ShortcutButton = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
	<Link to={to} className="flex min-w-[200px] items-center gap-3 rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-lg">
		<span className="text-2xl text-blue-600">{icon}</span>
		<span className="text-lg font-semibold text-gray-800">{label}</span>
	</Link>
)

export function DashboardPage() {
	const { user } = useAuth()

	const renderDashboard = () => {
		switch (user?.role) {
			case ROLES.Admin:
				return <AdminDashboard />
			case ROLES.Coordenador:
				return <CoordenadorDashboard />
			case ROLES.Musico:
				return <MusicoDashboard />
			default:
				return <p>Carregando...</p>
		}
	}

	return (
		<div>
			<h1 className="mb-2 text-3xl font-bold">
				Olá, <span className="text-blue-600">{user?.nome}!</span>
			</h1>
			<p className="mb-8 text-lg text-gray-600">
				Bem-vindo ao seu painel.
			</p>

			<div className="border-t pt-6">
				{renderDashboard()}
			</div>
		</div>
	)
}