import { VideoMetadata } from '@contentModule/shared/persistence/entity/video-metadata.entity'
import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Episode } from './episode.entity'
import { Movie } from './movie.entity'

@Entity({ name: 'Video' })
export class Video extends DefaultEntity<Video> {
  @Column({ type: 'varchar', nullable: false })
  url: string

  @Column('int')
  sizeInKb: number

  @Column({ type: 'int', nullable: true })
  duration: number | null

  @OneToOne(() => Movie, (movie) => movie.video)
  @JoinColumn()
  movie: Movie

  @Column({ type: 'uuid', nullable: true })
  movieId: string | null

  @OneToOne(() => Episode, (episode) => episode.video)
  @JoinColumn()
  episode: Episode

  @OneToOne(() => VideoMetadata, (textMetadata) => textMetadata.video, {
    cascade: true
  })
  metadata: VideoMetadata
}
