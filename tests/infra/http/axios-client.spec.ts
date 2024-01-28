import { HttpGetClient } from "@/infra/http"
import axios from "axios";

jest.mock('axios')

class AxiosHttpClient {
 async get(args: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, {
      params: args.params
    })

    return result
 }

}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios> 
  let url: string
  let params: object

  beforeEach(() => {
    sut = sut = new AxiosHttpClient()
  })

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any' }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      data: 'any_data',
      status: 200
    })
  })

  describe('get', () => {
    test('should call get with correct params', async () => {
        await sut.get({
          url,
          params
        })

        expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
          params
        })
        expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('should return data on success', async () => {
      fakeAxios.get.mockResolvedValueOnce({
        data: 'any_data',
        status: 200
      })
      const result = await sut.get({
        url,
        params
      })

      expect(result).toEqual({
        data: 'any_data',
        status: 200
      })
  })
  })
})
