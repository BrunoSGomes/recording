import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import {
  DataSource,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  Repository
} from 'typeorm'

export abstract class DefaultTypeOrmRepository<T extends DefaultEntity<T>> {
  private repository: Repository<T>
  constructor(
    readonly entity: EntityTarget<T>,
    readonly dataSource: DataSource
  ) {
    /**
     * Note that we don't extend the Repository class from TypeORM, but we use it as a property.
     * This way we can control the access to the repository methods and avoid exposing them to the outside world.
     */
    this.repository = dataSource.getRepository(entity)
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity)
  }

  async findOneById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations
    })
  }

  async find(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists({
      where: { id } as FindOptionsWhere<T>
    })
  }

  async existsBy(properties: FindOptionsWhere<T>): Promise<boolean> {
    return this.repository.exists({
      where: properties
    })
  }
}
