import { File } from 'src/entities'
import { T_Tokens } from 'src/models'

export interface I_Auth extends T_Tokens {
  id: number
  email: string
  firstName: string
  lastName: string
  active: boolean
  avatar: Omit<File, 'id'>
}

export type T_AuthRefresh = T_Tokens
