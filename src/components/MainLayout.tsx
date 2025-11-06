import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as RoleModule from '../auth/role.definition'
import React, { useState } from 'react'
import {
    FaTachometerAlt, FaMusic, FaCalendarAlt, FaTags, FaUsers,
    FaUserShield, FaSitemap, FaSignOutAlt,
    FaBars,
    FaTimes
} from 'react-icons/fa'

export function MainLayout() {
    const { user, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isCoordenador = user?.role === RoleModule.ROLES.Coordenador
    const isAdmin = user?.role === RoleModule.ROLES.Admin

    const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
        <Link
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg p-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    )

    const sidebarContent = (
        <div>
            <div className="flex items-center justify-center gap-2 p-4 text-2xl font-bold text-white">
                <FaMusic className="text-blue-400" /> S. Cecília
            </div>

            <nav className="flex-1 space-y-1 p-2">
                <NavLink to="/" icon={<FaTachometerAlt />} label="Dashboard" />
                <NavLink to="/cifras" icon={<FaMusic />} label="Cifras" />
                <NavLink to="/celebracoes" icon={<FaCalendarAlt />} label="Celebrações" />
                {isCoordenador && (
                    <>
                        <NavLink to="/categorias" icon={<FaTags />} label="Categorias" />
                        <NavLink to="/gerenciar-grupos" icon={<FaUsers />} label="Gerenciar Grupos" />
                    </>
                )}
                {isAdmin && (
                    <div className="border-t border-gray-700 pt-3 mt-3">
                        <p className="px-3 py-1 text-xs font-semibold uppercase text-gray-500">Admin</p>
                        <NavLink to="/admin/usuarios" icon={<FaUserShield />} label="Gerenciar Usuários" />
                        <NavLink to="/admin/organizacao" icon={<FaSitemap />} label="Gerenciar Organização" />
                    </div>
                )}
            </nav>

            <div className="border-t border-gray-700 p-2">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left font-medium text-gray-300 transition-colors hover:bg-red-700 hover:text-white"
                >
                    <FaSignOutAlt />
                    Sair
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden w-64 flex-col bg-gray-800 text-white shadow-lg md:flex">
                {sidebarContent}
            </div>

            <div
                className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-gray-800 text-white shadow-lg transition-transform duration-300 md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {sidebarContent}
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <div className="flex flex-1 flex-col">

                <div className="flex h-16 items-center justify-between bg-white px-4 shadow-md md:hidden">
                    <span className="text-xl font-bold text-gray-800">S. Cecília</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl text-gray-700">
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}