import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUsecase } from '@/data/usecases'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account', () => {
  return {
    FacebookAccount: jest.fn().mockImplementation(() => {
      return {
        any: 'any'
      }
    })
  }
})

describe('FacebookAuthenticationUsecase', () => {
  let sut: FacebookAuthenticationUsecase
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  
  let token = 'any_token'
  beforeEach(() => {
    facebookApiSpy = mock<LoadFacebookUserApi>()
    userAccountRepo = mock()
    facebookApiSpy.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id'})
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generetad_token')
    sut = new FacebookAuthenticationUsecase(facebookApiSpy, userAccountRepo, crypto)
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

  test('should call SaveFacebookAccountRepo with FacebookAccount', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({ 
      key: 'any_account_id' ,
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('should return AccessToken on success', async () => {
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AccessToken('any_generetad_token'))
  })

  test('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApiSpy.loadUser.mockRejectedValueOnce(new Error('any_fb_error'))
    const promise = sut.perform({ token })
    expect(promise).rejects.toThrow(new Error('any_fb_error'))
  })

  test('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('any_load_account_error'))
    const promise = sut.perform({ token })
    expect(promise).rejects.toThrow(new Error('any_load_account_error'))
  })

  test('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('any_save_account_error'))
    const promise = sut.perform({ token })
    expect(promise).rejects.toThrow(new Error('any_save_account_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('any_token_error'))
    const promise = sut.perform({ token })
    expect(promise).rejects.toThrow(new Error('any_token_error'))
  })
})
