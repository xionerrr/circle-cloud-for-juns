import { E_Roles, T_Tokens } from 'src/models'

export interface I_Auth extends T_Tokens {
  id: number
  email: string
  firstName: string
  lastName: string
  active: boolean
  avatar: string
  role: E_Roles
}

export type T_AuthRefresh = T_Tokens
