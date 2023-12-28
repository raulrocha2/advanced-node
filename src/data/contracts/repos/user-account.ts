export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepo.Params) => Promise<LoadUserAccountRepo.Result>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string,
    name?: string
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

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (params: UpdateFacebookAccountRepo.Params) => Promise<void>
}

export namespace UpdateFacebookAccountRepo {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}
