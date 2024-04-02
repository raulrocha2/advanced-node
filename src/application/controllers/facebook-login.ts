import { FacebookAuthentication } from "@/domain/features"
import { AccessToken } from "@/domain/models"
import { HttpResponse, badRequest, ok, serverError, unauthorized } from "./helpers/http"
import { RequiredFieldError, ServerError } from "./errors/http"

type HttpRequest = {
  token: string | undefined | null 
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
   try {
    if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      
      return badRequest(new RequiredFieldError('token'))
      
    }
    
    const accessToken = await this.facebookAuth.perform({ token: httpRequest.token})
    if (accessToken instanceof AccessToken) {
      return  ok({accessToken: accessToken.value})
    } else {
      return unauthorized()
    }
   } catch (error) {
    return serverError(new ServerError(error))
   }
  }
}
