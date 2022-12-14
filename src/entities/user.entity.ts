import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { Task } from './task.entity'

import { E_Roles, T_UserId } from 'src/models'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: T_UserId

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  hashedRt: string

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({
    default: true,
  })
  active: boolean

  @Column({ nullable: true })
  avatar: string

  @Column({
    type: 'simple-enum',
    default: E_Roles.user,
  })
  role: E_Roles

  @OneToMany(() => Task, (task) => task.creator)
  tasks: Task[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
