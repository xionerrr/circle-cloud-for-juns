import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'files',
})
export class File {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  fileName: string

  @Column()
  url: string

  @Column()
  mimetype: string
}
