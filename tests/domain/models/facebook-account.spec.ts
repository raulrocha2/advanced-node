import { FacebookAccount } from "@/domain/models"

describe('FacebookAccount', () => {
  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  test('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)
    expect(sut).toEqual(fbData)
  })

  test('should update name if its empty', () => {
    const acccountData = {id: 'any_id'}
    const sut = new FacebookAccount(fbData, acccountData)
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  test('should not update name if its not empty', () => {
    const acccountData = { id: 'any_id', name: 'any_name' }
    const sut = new FacebookAccount(fbData, acccountData)
    expect(sut).toEqual({
      id: acccountData.id,
      name: acccountData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })
  })
})
