import {
  configSchema,
  environmentSchema
} from '@src/infra/module/config/util/config.schema'
import { z } from 'zod'

export type Environment = z.infer<typeof environmentSchema>

export type Config = z.infer<typeof configSchema>
