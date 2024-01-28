import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')


class JwtTokenGenerator {
  constructor(
    private readonly secretKey: string
  ) { }
  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
     jwt.sign({key: params.key}, this.secretKey, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  test('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret_key')
    await sut.generateToken({key: 'any_key', expirationInMs: 1000})
    expect(fakeJwt.sign).toHaveBeenCalledWith({key: "any_key"}, "any_secret_key", {expiresIn: 1})
  })
})
