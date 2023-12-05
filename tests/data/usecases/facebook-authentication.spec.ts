import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookAuthenticationUsecase', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = {
      loadUser: jest.fn()
    }
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
