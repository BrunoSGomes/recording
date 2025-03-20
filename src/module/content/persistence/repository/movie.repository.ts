import { DefaultTypeOrmRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository'
import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Movie } from '../entity/movie.entity'

@Injectable()
export class MovieRepository extends DefaultTypeOrmRepository<Movie> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Movie, dataSource)
  }
}
