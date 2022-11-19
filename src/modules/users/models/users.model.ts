import { User } from 'src/entities'

export type T_User = Omit<User, 'password' | 'hashedRt'>
