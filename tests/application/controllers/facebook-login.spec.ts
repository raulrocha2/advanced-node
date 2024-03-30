import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { mock, MockProxy } from "jest-mock-extended"

class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) { }
  async handle (httpRequest: any): Promise<HttpResponse> {
    if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    
    const result = await this.facebookAuth.perform({ token: httpRequest.token})
    return {
      statusCode: 401,
      data: result
    }
  }
}

type HttpResponse = { statusCode: number, data: any}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  beforeEach(() => {
    facebookAuth = mock<FacebookAuthentication>()
    sut = new FacebookLoginController(facebookAuth)
  })

  test('should return 400 if token is empty', async  () => {
      const httpResponse = await sut.handle({ token: ''})
      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new Error('The field token is required')
      })
  })

  test('should return 400 if token is null', async  () => {
    const httpResponse = await sut.handle({ token: null})
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should return 400 if token is undefined', async  () => {
    const httpResponse = await sut.handle({ token: undefined})
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should call FacebookAuthentication with correct params', async  () => {
    await sut.handle({ token: 'any_token'})
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token'})
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if token is undefined', async  () => {
    facebookAuth.perform.mockResolvedValueOnce( new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'invalid_token'})
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})
