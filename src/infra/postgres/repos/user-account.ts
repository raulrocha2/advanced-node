import { getRepository } from "typeorm"
import { LoadUserAccountRepo, LoadUserAccountRepository } from "@/data/contracts/repos"
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

}
