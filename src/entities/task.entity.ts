import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

import { User } from './user.entity'

import { T_TaskId } from 'src/models/task.model'

@Entity({
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: T_TaskId

  @Column()
  title: string

  @Column()
  description: string

  @Column({ default: 'firstly' })
  priority: string

  @ManyToOne(() => User, (user) => user.tasks)
  creator: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
