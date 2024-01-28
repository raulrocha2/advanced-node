import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')


class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secretKey: string
  ) { }
  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
     const token = jwt.sign({key: params.key}, this.secretKey, { expiresIn: expirationInSeconds })
     return token
  }
}

describe('JwtTokenGenerator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtTokenGenerator
  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret_key')
  })

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation( () => 'any_token' )
  })

  test('should call sign with correct params', async () => {
    await sut.generateToken({key: 'any_key', expirationInMs: 1000})
    expect(fakeJwt.sign).toHaveBeenCalledWith({key: "any_key"}, "any_secret_key", {expiresIn: 1})
  })

  test('should return a token', async () => {
    const token = await sut.generateToken({key: 'any_key', expirationInMs: 1000})
    expect(token).toBe('any_token')
  })

  test('should rethrow if jwt throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {throw new Error('jwt_error')})
    const promise = sut.generateToken({key: 'any_key', expirationInMs: 1000})
    expect(promise).rejects.toThrow(new Error('jwt_error'))
  })

})
