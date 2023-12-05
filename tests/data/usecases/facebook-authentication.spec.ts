import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationUsecase
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy)
  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('FacebookAuthenticationUsecase', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
   const { sut, loadFacebookUserApiSpy } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
