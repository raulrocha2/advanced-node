import { ValidationComposite, Validator } from "@/application/validation";
import { MockProxy, mock } from "jest-mock-extended";

describe("ValidationComposite", () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeEach(() => {
    validator1 = mock<Validator>();
    validator1.validate.mockReturnValue(undefined);
    validator2 = mock<Validator>();
    validator2.validate.mockReturnValue(undefined);
    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  test("should return undefined if all Validators return undefined", () => {
    const error = sut.validate();
    expect(error).toBeUndefined();
  });

  test("should return the first error", () => {
    validator1.validate.mockReturnValueOnce(new Error("First error"));
    validator2.validate.mockReturnValueOnce(new Error("Second error"));
    const error = sut.validate();
    expect(error).toEqual(new Error("First error"));
  });

  test("should return the error", () => {
    validator2.validate.mockReturnValueOnce(new Error("error"));
    const error = sut.validate();
    expect(error).toEqual(new Error("error"));
  });
});
