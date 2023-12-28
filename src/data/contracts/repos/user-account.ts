export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepo.Params) => Promise<void>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepo.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepo {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}
