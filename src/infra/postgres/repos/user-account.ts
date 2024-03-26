import { getRepository } from "typeorm"
import { LoadUserAccountRepo, LoadUserAccountRepository, SaveFacebookAccountRepo } from "@/data/contracts/repos"
import { PgUser } from "@/infra/postgres/entities"

export class PgUserAccountRepository implements LoadUserAccountRepository {
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

  async saveWithFacebook (params: SaveFacebookAccountRepo.Params): Promise<any> {
    const pgUserRepo =  getRepository(PgUser)
    if (params.id !== undefined) {
      await pgUserRepo.update({
        id: parseInt(params.id)
      },
      {
        name: params.name,
        facebookId: params.facebookId
      })

    } else {
      await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
    }
    
  }
  
}
