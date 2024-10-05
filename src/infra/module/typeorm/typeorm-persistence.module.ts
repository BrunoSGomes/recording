import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DefaultEntity } from './entity/default.entity'
import { ConfigModule } from '@src/infra/module/config/config.module'
import { TypeOrmMigrationService } from './service/typeorm-migration.service'
import { ConfigService } from '../config/service/config.service'

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
          useFactory: async (...args: any[]) => {
            const configService: ConfigService = args.find(
              (arg) => arg instanceof ConfigService
            )

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
          }
        })
      ],
      providers: [TypeOrmMigrationService],
      exports: [TypeOrmMigrationService]
    }
  }
}
