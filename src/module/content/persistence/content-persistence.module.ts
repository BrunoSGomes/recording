import { ContentRepository } from '@contentModule/persistence/repository/content.repository'
import { EpisodeRepository } from '@contentModule/persistence/repository/episode.repository'
import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { dataSourceOptionsFactory } from '@contentModule/persistence/typeorm-datasource.factory'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { ConfigService } from '@sharedModules/config/service/config.service'
import { TypeOrmPersistenceModule } from '@sharedModules/persistence/typeorm/typeorm-persistence.module'
import { DataSource } from 'typeorm'
import { addTransactionalDataSource } from 'typeorm-transactional'

@Module({
  imports: [
    TypeOrmPersistenceModule.forRoot({
      imports: [ConfigModule.forRoot()],
      name: 'content',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return dataSourceOptionsFactory(configService)
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed')
        }
        return addTransactionalDataSource({
          name: options.name,
          dataSource: new DataSource(options)
        })
      }
    })
  ],
  providers: [ContentRepository, EpisodeRepository, VideoRepository],
  exports: [ContentRepository, EpisodeRepository, VideoRepository]
})
export class ContentPersistenceModule {}
