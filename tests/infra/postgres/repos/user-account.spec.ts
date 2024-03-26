import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from "typeorm"
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos';
import { makeDbMemory } from '@/tests/infra/postgres/mocks/connection';



describe('PgUserAccountRepository', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let dbBackup: IBackup
    beforeAll( async () => {
      const db = await makeDbMemory([PgUser])
      dbBackup = db.backup()
      pgUserRepo = getRepository(PgUser)
      
    })

    beforeEach(() => {
      dbBackup.restore()
        sut = new PgUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })


  describe('load', () => { 
    test('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_exist@email.com' })
      const account = await sut.load({ email: 'any_exist@email.com' })
      expect(account).toEqual({id: '1'})
    })

    test('should return undefined if email not exists', async () => {
      const account = await sut.load({ email: 'new-email@email.com' })
      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => { 

    test('should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({ 
        email: 'new_email@email.com',
        name: 'any_name',
        facebookId: 'any_facebookId'
      })
      const pgUser = await pgUserRepo.findOne({ email: 'new_email@email.com'})
      expect(pgUser?.id).toBe(1)
    })

    test('should update an account if id is defined', async () => {
      await pgUserRepo.save({ 
        email: 'any_email@email.com',
        name: 'any_name',
        facebookId: 'any_facebookId'
      })

      await sut.saveWithFacebook({ 
        id: '1',
        email: 'any_email@email.com',
        name: 'new_name',
        facebookId: 'new_facebookId'
      })
      
      const pgUser = await pgUserRepo.findOne({ id: 1})


      expect(pgUser).toEqual({ 
        id: 1,
        email: 'any_email@email.com',
        name: 'new_name',
        facebookId: 'new_facebookId'
      })
    })
  })
})
