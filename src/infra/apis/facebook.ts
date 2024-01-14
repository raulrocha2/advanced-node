import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { HttpGetClient } from "../http"

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly grantType: string
  ) { }
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ 
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId, 
        client_secret: this.clientSecret, 
        grant_type: this.grantType
      }
    })
  }
}
