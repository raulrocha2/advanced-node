import { RequiredFieldError } from "@/application/controllers/errors/http"

export class RequireStringValidator {
  
  validate(value: string, fieldName: string): Error | undefined {
    if (value === '' || value === undefined || value === null) {
      return new RequiredFieldError(fieldName)
    }
  }
}
