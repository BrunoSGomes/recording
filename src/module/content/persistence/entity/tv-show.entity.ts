import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { Content } from './content.entity'
import { Episode } from './episode.entity'
import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Thumbnail } from '@contentModule/persistence/entity/thumbnail.entity'

@Entity({ name: 'TvShow' })
export class TvShow extends DefaultEntity<TvShow> {
  @OneToMany(() => Episode, (episode) => episode.tvShow)
  episodes: Episode[]

  @OneToOne(() => Content, (content) => content.tvShow)
  @JoinColumn()
  content: Content

  @OneToOne(() => Thumbnail, {
    cascade: true
  })
  @JoinColumn()
  thumbnail: Thumbnail
}
