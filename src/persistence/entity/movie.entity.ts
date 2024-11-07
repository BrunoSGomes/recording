import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Content } from './content.entity'
import { Video } from './video.entity'
import { DefaultEntity } from '@src/infra/module/typeorm/entity/default.entity'
import { Thumbnail } from '@src/persistence/entity/thumbnail.entity'

@Entity({ name: 'Movie' })
export class Movie extends DefaultEntity<Movie> {
  @OneToOne(() => Video, (video) => video.movie, {
    cascade: true
  })
  video: Video

  @Column({ type: 'float', nullable: true })
  externalRating: number | null

  @OneToOne(() => Content, (content) => content.movie)
  @JoinColumn()
  content: Content

  @OneToOne(() => Thumbnail, {
    cascade: true
  })
  @JoinColumn()
  thumbnail: Thumbnail
}
