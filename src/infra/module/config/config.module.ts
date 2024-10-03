/* eslint-disable no-restricted-imports */
import { DynamicModule } from '@nestjs/common'
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions as NestConfigModuleOptions
} from '@nestjs/config'
import { ConfigService } from './service/config.service'
import { factory } from '@src/infra/module/config/util/config.factory'

export class ConfigModule {
  static forRoot(options?: NestConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          ...options,
          expandVariables: true,
          load: options?.load ? [factory, ...options.load] : [factory]
        })
      ],
      providers: [ConfigService],
      exports: [ConfigService]
    }
  }
}
