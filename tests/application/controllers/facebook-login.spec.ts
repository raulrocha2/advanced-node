import { FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/errors/http";
import { RequiredStringValidator } from "@/application/validation";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookLoginController", () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    token = "any_token";
    facebookAuth = mock<FacebookAuthentication>();
    facebookAuth.perform.mockResolvedValue(new AccessToken("any_value"));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  test("should build Validators correctly", async () => {
    const validators = sut.buildValidators({ token: "" });
    expect(validators).toEqual([new RequiredStringValidator("", "token")]);
  });

  test("should call FacebookAuthentication with correct params", async () => {
    await sut.handle({ token });
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  test("should return 401 if token is undefined", async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token: "invalid_token" });
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  test("should return 200 if authentication succeeds", async () => {
    const httpResponse = await sut.handle({ token });
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: "any_value",
      },
    });
  });
});
