import { UserRepository } from '@identityModule/persistence/repository/user.repository'
import { dataSourceOptionsFactory } from '@identityModule/persistence/typeorm-datasource.factory'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { ConfigService } from '@sharedModules/config/service/config.service'
import { TypeOrmPersistenceModule } from '@sharedModules/persistence/typeorm/typeorm-persistence.module'

@Module({
  imports: [
    TypeOrmPersistenceModule.forRoot({
      name: 'identity',
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return dataSourceOptionsFactory(configService)
      }
    })
  ],
  providers: [UserRepository],
  exports: [UserRepository]
})
export class IdentityPersistenceModule {}
