import { User } from 'src/entities/user.entity'

export type T_User = Omit<User, 'password' | 'hashedRt'>
