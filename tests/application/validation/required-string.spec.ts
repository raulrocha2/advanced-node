import { RequiredStringValidator } from "@/application/validation"


describe('RequireStringValidator', () => {
  test('should return Error if value is empty', () => {
    const sut = new RequiredStringValidator()
    const error = sut.validate('', 'any_field_name')
    expect(error).toEqual(new Error('The field any_field_name is required'))
  })

  test('should return Error if value is null', () => {
    const sut = new RequiredStringValidator()
    const error = sut.validate(null as any, 'any_field_name')
    expect(error).toEqual(new Error('The field any_field_name is required'))
  })

  test('should return Error if value is undefined', () => {
    const sut = new RequiredStringValidator()
    const error = sut.validate(undefined as any, 'any_field_name')
    expect(error).toEqual(new Error('The field any_field_name is required'))
  })

  test('should return undefined if value is valid', () => {
    const sut = new RequiredStringValidator()
    const error = sut.validate('any_value', 'any_field_name')
    expect(error).toBeUndefined()
  })
})
