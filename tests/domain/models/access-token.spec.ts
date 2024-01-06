import { AccessToken } from "@/domain/models"

describe('AccessToken', () => {
  test('should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value'})
  })

  test('should expire in 1800000', () => {
    expect(AccessToken.expirationInMs).toEqual(1800000)
  })

})
