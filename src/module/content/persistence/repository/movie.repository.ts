import { Inject, Injectable } from '@nestjs/common'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'
import { Movie } from '@contentModule/persistence/entity/movie.entity'

@Injectable()
export class MovieRepository extends DefaultTypeOrmRepository<Movie> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Movie, dataSource)
  }
}
