import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { LoadUserAccountRepo } from '../contracts/repos'

export class FacebookAuthenticationUsecase {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepo
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if(fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData?.email})
    }
    return new AuthenticationError()
  }
}
