import { FacebookApi } from "@/infra/apis"
import { HttpGetClient } from "@/infra/http"
import { MockProxy, mock } from "jest-mock-extended"


describe('FacebookApi', () => {
  let clientId: string 
  let clientSecret: string
  let grantType: string
  let httpClient: MockProxy<HttpGetClient>
  let sut: FacebookApi

  beforeAll(() => {
    clientId = 'any_client_id' 
    clientSecret = 'any_client_secret'
    grantType = 'client_credentials'
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token'})
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' }})
      .mockResolvedValueOnce({
        id: 'any_fb_id',
        name: 'any_fb_name',
        email: 'any_fb_email'})
     sut = new FacebookApi(
      httpClient,
      clientId,
      clientSecret,
      grantType
      )
  })

  test('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token'})
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId, 
        client_secret: clientSecret, 
        grant_type: grantType
      }
    })
  })

  test('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token'})
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  test('should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token'})
    expect(httpClient.get).toHaveBeenCalledWith({
      url: `https://graph.facebook.com/any_user_id`,
      params: {
        fields: 'id,name,email', 
        access_token: 'any_client_token'
      }
    })
  })

  test('should return facebook user', async () => {
    const fbUserInfo = await sut.loadUser({ token: 'any_client_token'})
    expect(fbUserInfo).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })
})
