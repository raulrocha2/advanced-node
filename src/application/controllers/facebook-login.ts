import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import {
  HttpResponse,
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "./helpers/http";
import { ServerError } from "./errors/http";
import {
  ValidationBuilder,
  ValidationComposite,
} from "@/application/validation";

type HttpRequest = {
  token: string;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const validateTokenError = this.validate(httpRequest);
      if (validateTokenError !== undefined) {
        return badRequest(validateTokenError);
      }

      const accessToken = await this.facebookAuth.perform({
        token: httpRequest.token,
      });
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      } else {
        return unauthorized();
      }
    } catch (error) {
      return serverError(new ServerError(error));
    }
  }

  private validate(httpRequest: HttpRequest): Error | undefined {
    const validators = ValidationBuilder.of({
      value: httpRequest.token,
      fieldName: "token",
    })
      .required()
      .build();
    return new ValidationComposite(validators).validate();
  }
}
