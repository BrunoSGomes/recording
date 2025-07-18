import { NestFactory } from '@nestjs/core'
import { LoggerFactory } from '@sharedModules/logger/util/logger.factory'
import { initializeTransactionalContext } from 'typeorm-transactional'
import { AppModule } from './app.module'

async function bootstrap() {
  initializeTransactionalContext()
  const logger = LoggerFactory('application-main')
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })
  app.useLogger(logger)
  await app.listen(3000)
}
bootstrap()
