import { Movie } from '@contentModule/persistence/entity/movie.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class MovieRepository extends DefaultTypeOrmRepository<Movie> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource
  ) {
    super(Movie, dataSource.manager)
  }
}
