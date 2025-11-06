
export const ROLES = {
  Admin: 'Admin',
  Coordenador: 'Coordenador',
  Musico: 'Musico',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]