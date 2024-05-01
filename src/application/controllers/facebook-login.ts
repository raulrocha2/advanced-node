import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { HttpResponse, ok, unauthorized } from "../helpers/http";
import { ValidationBuilder, Validator } from "@/application/validation";
import { Controller } from "./controller";

type HttpRequest = {
  token: string;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super();
  }
  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({
      token: httpRequest.token,
    });
    if (accessToken instanceof AccessToken) {
      return ok({ accessToken: accessToken.value });
    } else {
      return unauthorized();
    }
  }

  override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({
        value: httpRequest.token,
        fieldName: "token",
      })
        .required()
        .build(),
    ];
  }
}
