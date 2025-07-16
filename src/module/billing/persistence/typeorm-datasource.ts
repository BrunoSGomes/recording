import { dataSourceOptionsFactory } from '@billingModule/persistence/typeorm-datasource.factory'
import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@sharedModules/config/config.module'
import { ConfigService } from '@sharedModules/config/service/config.service'

import { DataSource } from 'typeorm'

const getDataSource = async () => {
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot()
  )
  const configService = configModule.get<ConfigService>(ConfigService)

  return new DataSource(dataSourceOptionsFactory(configService))
}

export default getDataSource()
