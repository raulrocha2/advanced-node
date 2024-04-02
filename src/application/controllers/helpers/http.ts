import { UnauthorizedError } from "../errors/http"

export type HttpResponse<T = any> = { statusCode: number, data: T}
 
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  data: error
})

export const ok = <T= any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})
