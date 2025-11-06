import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { CifrasPage } from './pages/CifrasPage'
import { CifraCreatePage } from './pages/CifraCreatePage'
import { CifraEditPage } from './pages/CifraEditPage'
import { CelebracoesPage } from './pages/CelebracoesPage'
import { CelebracaoCreatePage } from './pages/CelebracaoCreatePage'
import { CelebracaoDetailPage } from './pages/CelebracaoDetailPage'
import { CelebracaoEditPage } from './pages/CelebracaoEditPage'
import { CategoriasPage } from './pages/CategoriasPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GuestRoute } from './components/GuestRoute'
import { MainLayout } from './components/MainLayout'
import { RegisterPage } from './pages/RegisterPage'
import { CifraViewPage } from './pages/CifraViewPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { AdminOrganizationPage } from './pages/AdminOrganizationPage'
import { GrupoManagementPage } from './pages/GrupoManagementPage'

function App() {
	return (
		<div className="h-screen w-full bg-gray-100 text-gray-900">
			<Routes>
				<Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>}/>
				<Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
				<Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
					<Route index element={<DashboardPage />} />
					<Route path="cifras" element={<CifrasPage />} />
					<Route path="cifras/nova" element={<CifraCreatePage />} />
					<Route path="cifras/:id" element={<CifraViewPage />} />
					<Route path="cifras/:id/editar" element={<CifraEditPage />} />
					<Route path="celebracoes" element={<CelebracoesPage />} />
					<Route path="celebracoes/nova" element={<CelebracaoCreatePage />} />
					<Route path="celebracoes/:id" element={<CelebracaoDetailPage />} />
					<Route path="celebracoes/:id/editar" element={<CelebracaoEditPage />} />
					<Route path="categorias" element={<CategoriasPage />} />
					<Route path="gerenciar-grupos" element={<GrupoManagementPage />} />
					<Route path="admin/usuarios" element={<AdminUsersPage />} />
					<Route path="admin/organizacao" element={<AdminOrganizationPage />} />
				</Route>
				<Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
			</Routes>
		</div>
	)
}

export default App