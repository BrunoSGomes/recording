import { ContentType } from '@contentModule/core/enum/content-type.enum'
import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Column, Entity, OneToOne } from 'typeorm'
import { Movie } from './movie.entity'
import { TvShow } from './tv-show.entity'

@Entity({ name: 'Content' })
export class Content extends DefaultEntity<Content> {
  @Column({ nullable: false, type: 'enum', enum: ContentType })
  type: ContentType

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @Column('text')
  description: string

  @Column({ type: 'int', nullable: true })
  ageRecommendation: number | null

  @OneToOne(() => Movie, (movie) => movie.content, {
    cascade: true
  })
  movie: Movie | null

  @OneToOne(() => TvShow, (tvShow) => tvShow.content, {
    cascade: true
  })
  tvShow: TvShow | null
}
