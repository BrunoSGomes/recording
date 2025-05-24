import { DefaultModel } from '@sharedLibs/core/model/default.model'
import { InferSelectModel, eq } from 'drizzle-orm'
import { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export abstract class DrizzleDefaultRepository<
  M extends DefaultModel,
  T extends AnyPgTable & { id: AnyPgColumn }
> {
  constructor(
    protected readonly db: PostgresJsDatabase<any>,
    protected readonly table: T
  ) {}

  async create(model: M): Promise<void> {
    await this.db.insert(this.table).values(model)
  }

  async findById(id: string): Promise<M | null> {
    const res = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
    if (res.length === 0) return null
    return this.mapToModel(res[0] as InferSelectModel<T>)
  }

  protected abstract mapToModel(data: InferSelectModel<T>): M

  async deleteAll(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      await this.db.delete(this.table).execute()
    }
  }
}
