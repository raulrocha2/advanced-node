import { getRepository } from "typeorm"
import { LoadUserAccountRepo, LoadUserAccountRepository, SaveFacebookAccountRepo, SaveFacebookAccountRepository } from "@/data/contracts/repos"
import { PgUser } from "@/infra/postgres/entities"

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo =  getRepository(PgUser)

  async load (params: LoadUserAccountRepo.Params): Promise<LoadUserAccountRepo.Result> {
    const account =  await this.pgUserRepo.findOne({ email: params.email})
    if (account !== undefined) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined 
      }
    }
    
  }

  async saveWithFacebook (params: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    let id: string

    if (params.id !== undefined) {
      await this.pgUserRepo.update({
        id: parseInt(params.id)
      },
      {
        name: params.name,
        facebookId: params.facebookId
      })
      id = params.id
    } else {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })

      id = pgUser.id.toString()
    }
    
    return { id }

  }
  
}
