import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { HttpClientException } from '@sharedModules/http-client/exception/http-client.exception'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class HttpClient {
  constructor(private readonly httpService: HttpService) {}

  async get<T extends Record<string, any>>(
    url: string,
    options: Record<string, any>
  ): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService.get<T>(url, options).pipe(
        catchError((error: AxiosError) => {
          throw new HttpClientException(
            `Error fetching data from ${url}: ${error}`
          )
        })
      )
    )
    return data
  }
}
