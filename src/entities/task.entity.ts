import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { T_TaskId } from 'src/models/task.model'

@Entity({
  name: 'tasks',
})
export class Tasks {
  @PrimaryGeneratedColumn()
  id: T_TaskId

  @Column()
  title: string

  @Column()
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
