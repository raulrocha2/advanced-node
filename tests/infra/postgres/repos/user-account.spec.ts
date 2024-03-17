import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getRepository, Repository, getConnection } from "typeorm"
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos';


const makeDbMemory = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize();
  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => { 
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
})
