import { NestFactory } from '@nestjs/core'
import { initializeTransactionalContext } from 'typeorm-transactional'
import { AppModule } from './app.module'

async function bootstrap() {
  initializeTransactionalContext()
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
bootstrap()
