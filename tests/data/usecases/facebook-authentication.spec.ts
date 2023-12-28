import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationUsecase', () => {
  let sut: FacebookAuthenticationUsecase
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>
  let token = 'any_token'
  beforeEach(() => {
    facebookApiSpy = mock<LoadFacebookUserApi>()
    userAccountRepo = mock()
    sut = new FacebookAuthenticationUsecase(facebookApiSpy, userAccountRepo)
    facebookApiSpy.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApiSpy.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should calls LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email:'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should calls CreateFacebookAccountRepo when LoadFacebookUserApi returns undefined', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
     })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
  
})

