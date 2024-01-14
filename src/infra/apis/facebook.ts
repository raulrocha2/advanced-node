import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { HttpGetClient } from "../http"

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly grantType: string
  ) { }
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const appToken = await this.httpGetClient.get({ 
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId, 
        client_secret: this.clientSecret, 
        grant_type: this.grantType
      }
    })
    const debugToken = await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })

    const userFbInfo = await this.httpGetClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','), 
        access_token: 'any_access_token'
      }
    })

    return {
      facebookId: userFbInfo.id,
      name: userFbInfo.name,
      email: userFbInfo.email
    }
  }
}
