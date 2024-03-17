import { newDb } from 'pg-mem'
import { LoadUserAccountRepo, LoadUserAccountRepository } from "@/data/contracts/repos"
import { Entity, Column, PrimaryGeneratedColumn, getRepository } from "typeorm"

@Entity({ name: 'usuarios'})
class PgUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'nome', nullable: true})
    name?: string

    @Column()
    email!: string

    @Column({ name: 'id_facebook', nullable: true})
    facebookId?: string

}

class PgUserAccountRepository implements LoadUserAccountRepository{
  async load (params: LoadUserAccountRepo.Params): Promise<LoadUserAccountRepo.Result> {
    const pgUserRepo =  getRepository(PgUser)
    const account =  await pgUserRepo.findOne({ email: params.email})
    if (account !== undefined) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined 
      }
    }
    
  }

}

describe('PgUserAccountRepository', () => {
  describe('load', () => { 
    test('should return an account if email exists', async () => {
      
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
          type: 'postgres',
          entities: [PgUser]
      })

      // create schema
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({ email: 'any_exist@email.com' })
      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'any_exist@email.com' })
      expect(account).toEqual({id: '1'})
      await connection.close()
    })

    test('should return undefined if email not exists', async () => {
      
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
          type: 'postgres',
          entities: [PgUser]
      })

      // create schema
      await connection.synchronize();
      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'new-email@email.com' })
      expect(account).toBeUndefined()
      await connection.close()

    })
   })
})
