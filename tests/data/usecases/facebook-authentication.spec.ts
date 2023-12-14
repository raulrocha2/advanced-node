import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationUsecase', () => {
  let sut: FacebookAuthenticationUsecase
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepo>
  let token = 'any_token'
  beforeEach(() => {
    loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
    loadUserAccountRepo = mock()
    sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy, loadUserAccountRepo)
    loadFacebookUserApiSpy.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should calls LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email:'any_fb_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
 
  })
})

