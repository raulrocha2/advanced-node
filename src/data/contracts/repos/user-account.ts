export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepo.Params) => Promise<void>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
}

export interface CreateUserAccountRepository {
  createFromFacebook: (params: CreateUserAccountRepo.Params) => Promise<void>
}

export namespace CreateUserAccountRepo {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}
