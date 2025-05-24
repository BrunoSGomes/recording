import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import fs from 'fs'

const testEnvFile = `.env.test`
const envFile = `.env`

if (!fs.existsSync(envFile)) {
  throw new Error('.env file not found')
}

// Ensure a test environment variable file exists because of the override config
// loading mechanics below.
if (!fs.existsSync(testEnvFile)) {
  throw new Error('.env.test file found')
}

// We don't want to have two dotenv files that are exactly the same, so we
// override the default with .env.test.
//
// If a .env.test file is not found, the DATABASE_URL will fallback to the
// default. Consequently, you'll lose your development database during the
// integration tests teardown. Hence, the check above.
dotenv.config({ path: envFile })
dotenv.config({ path: testEnvFile, override: true })

const host = process.env.DATABASE_HOST as string
const database = process.env.DATABASE_NAME as string

console.log(`Migrating database ${database} on host ${host}`)

export default defineConfig({
  schema: './src/module/billing/persistence/database.schema.ts',
  out: __dirname + '/migration',
  dialect: 'postgresql',
  tablesFilter: ['Subscription', 'Plan'],
  dbCredentials: {
    host,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database,
    ssl: false
  },

  verbose: true
})
