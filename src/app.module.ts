import { Module } from '@nestjs/common'
import { ContentModule } from '@contentModule/content.module'

@Module({
  imports: [ContentModule]
})
export class AppModule {}
