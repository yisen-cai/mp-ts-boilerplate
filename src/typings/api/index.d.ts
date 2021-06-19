/// <reference lib="./entity.d.ts"/>

namespace API {
  type WechatAuthResult = {
    user: any,
    auth: AuthResult
  }

  type AuthResult = {
    accessToken: string,
    expiration: number
  }

  type OkResult = {
    msg: string,
    location?: string
  }

  type ErrResult = {
    errMsg: string,
    errCode: number,
    details?: any
  }

}


