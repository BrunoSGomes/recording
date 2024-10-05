import { DefaultEntity } from '@src/infra/module/typeorm/entity/default.entity'
import { Column, Entity } from 'typeorm'

@Entity('Thumbnail')
export class Thumbnail extends DefaultEntity<Thumbnail> {
  @Column()
  url: string
}
