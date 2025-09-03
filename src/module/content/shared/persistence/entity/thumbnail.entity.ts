import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'Thumbnail' })
export class Thumbnail extends DefaultEntity<Thumbnail> {
  @Column({ type: 'varchar', nullable: false })
  url: string
}
