import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { HttpClient } from '@sharedModules/http-client/client/http.client'

@Module({
  imports: [HttpModule],
  providers: [HttpClient],
  exports: [HttpClient]
})
export class HttpClientModule {}
