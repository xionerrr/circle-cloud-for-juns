import { T_Tokens } from 'src/models/auth.model'

export interface I_Auth extends T_Tokens {
  id: number
  email: string
  firstName: string
  lastName: string
  active: boolean
}

export type T_AuthRefresh = T_Tokens
