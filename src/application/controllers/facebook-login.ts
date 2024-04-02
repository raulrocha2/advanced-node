import { FacebookAuthentication } from "@/domain/features"
import { AccessToken } from "@/domain/models"
import { HttpResponse, badRequest, unauthorized } from "./helpers/http"
import { RequiredFieldError, ServerError } from "./errors/http"


export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) { }
  async handle (httpRequest: any): Promise<HttpResponse> {
   try {
    if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      
      return badRequest(new RequiredFieldError('token'))
      
    }
    
    const result = await this.facebookAuth.perform({ token: httpRequest.token})
    if (result instanceof AccessToken) {
      return {
        statusCode: 200,
        data: {
          accessToken: result.value
        }
      }
    } else {
      return unauthorized()
    }
   } catch (error) {
    return {
      statusCode: 500,
      data: new ServerError(error)
    }
   }
  }
}
