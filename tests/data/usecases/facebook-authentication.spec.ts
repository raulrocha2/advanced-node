import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result: undefined
  callsCount = 0
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationUsecase', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.token).toBe('any_token')
    expect(loadFacebookUserApiSpy.callsCount).toBe(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    loadFacebookUserApiSpy.result = undefined
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
