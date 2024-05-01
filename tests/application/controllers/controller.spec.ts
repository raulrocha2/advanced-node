import { Controller } from "@/application/controllers";
import { ServerError } from "@/application/errors/http";
import { HttpResponse } from "@/application/helpers/http";
import { ValidationBuilder } from "@/application/validation";

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: "any_data",
  };
  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.result;
  }
}

describe("Controller", () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  test("should return 400 if validation fails", async () => {
    const error = [
      ...ValidationBuilder.of({
        value: "",
        fieldName: "any_field_name",
      })
        .required()
        .build(),
    ];
    jest.spyOn(sut, "buildValidators").mockReturnValueOnce(error);
    const httpResponse = await sut.handle("any_request");
    expect(httpResponse.statusCode).toBe(400);
  });

  test("should return 500 if perform throws", async () => {
    const error = new Error("infra_error");
    jest.spyOn(sut, "perform").mockRejectedValueOnce(error);
    const httpResponse = await sut.handle("any_value");
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  test("should return the same result as perform", async () => {
    const httpResponse = await sut.handle("any_value");
    expect(httpResponse).toEqual(sut.result);
  });
});
