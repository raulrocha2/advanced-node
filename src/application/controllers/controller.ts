import { HttpResponse, badRequest, serverError } from "../helpers/http";
import { ValidationComposite, Validator } from "@/application/validation";
import { ServerError } from "@/application/errors/http";

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>;
  buildValidators(httpRequest: any): Validator[] {
    return [];
  }
  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error !== undefined) {
      return badRequest(error);
    }
    try {
      return await this.perform(httpRequest);
    } catch (error) {
      return serverError(new ServerError(error));
    }
  }

  private validate(httpRequest: any): Error | undefined {
    return new ValidationComposite(
      this.buildValidators(httpRequest)
    ).validate();
  }
}
