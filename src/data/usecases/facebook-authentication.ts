import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationUsecase {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if(fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData?.email})
      await this.userAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
