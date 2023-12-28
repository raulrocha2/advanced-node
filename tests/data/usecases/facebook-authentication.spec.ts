import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationUsecase', () => {
  let sut: FacebookAuthenticationUsecase
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
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

  test('should create account with facebook data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
     })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
  
  test('should calls SaveFacebookAccountRepo when LoadFacebookUserApi returns data', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      email: 'any_fb_email',
      name: 'any_name',
      facebookId: 'any_fb_id'
     })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should update account name', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id'
    })

    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
     })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})

