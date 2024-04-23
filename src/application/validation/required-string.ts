import { RequiredFieldError } from "@/application/controllers/errors/http";

export class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}
  validate(): Error | undefined {
    if (this.value === "" || this.value === undefined || this.value === null) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
