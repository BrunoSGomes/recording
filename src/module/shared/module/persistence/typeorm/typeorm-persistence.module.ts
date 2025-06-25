import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@sharedModules/config/config.module'
import { ConfigService } from '@sharedModules/config/service/config.service'
import { DataSource } from 'typeorm'
import { addTransactionalDataSource } from 'typeorm-transactional'
import { DefaultEntity } from './entity/default.entity'
import { TypeOrmMigrationService } from './service/typeorm-migration.service'

@Module({})
export class TypeOrmPersistenceModule {
  static forRoot(options: {
    migrations?: string[]
    entities?: Array<typeof DefaultEntity>
  }): DynamicModule {
    return {
      module: TypeOrmPersistenceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useFactory: async (configService) => {
            return {
              type: 'postgres',
              logging: false,
              autoLoadEntities: false,
              synchronize: false,
              migrationsTableName: 'typeorm_migrations',
              //types are infered by the compiler and zod
              ...configService.get('database'),
              ...options
            }
          },
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error('Invalid options passed')
            }

            return addTransactionalDataSource(new DataSource(options))
          }
        })
      ],
      providers: [TypeOrmMigrationService],
      exports: [TypeOrmMigrationService]
    }
  }
}
