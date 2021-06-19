import Config from '../config/config';

const app = <App.AppOption>getApp();

export namespace Network {
  const serverErrorPattern = new RegExp("^5..$");

  const clientErrorPattern = new RegExp("^4..$");

  const redirectPattern = new RegExp("^3..$");

  const okPattern = new RegExp("^2..$");

  export function buildRequest(isAuth: boolean, host: string = Config.API_ROOT!!): Request {
    return new Request(host, isAuth);
  }

  export class Request {
    host: string;
    isAuth: boolean = false;
    headers: Map<string, any> = new Map();

    constructor(host: string, isAuth: boolean) {
      this.isAuth = isAuth;
      this.host = host;
    }

    get(
      url: string,
      params?: Map<string, any>,
      headers?: Map<string, any>
    ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
      return this.send(url, HttpMethod.GET, params, headers);
    }

    post(
      url: string,
      data: any,
      params?: Map<string, any>,
      headers?: Map<string, any>
    ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
      return this.send(url, HttpMethod.POST, data, params, headers);
    }

    delete(
      url: string,
      headers?: Map<string, any>
    ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
      return this.send(url, HttpMethod.DELETE, headers);
    }

    put(
      url: string,
      data: any,
      params?: Map<string, any>,
      headers?: Map<string, any>
    ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
      return this.send(url, data, params, headers);
    }

    send(
      url: string,
      method: HttpMethod,
      data?: any,
      params?: Map<string, any>,
      headers?: Map<string, any>
    ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
      return new Promise<WechatMiniprogram.RequestSuccessCallbackResult>(
        (resolve, reject) => {
          // need login and not logged in
          if (this.isAuth && !app.auth) {
            wx.navigateTo({
              url: '/pages/login/index'
            });
            return;
          }

          // using wx api build request
          wx.request({
            url: this.generateUrl(url),
            data: data,
            method: method,
            header: this.generateHeaders(this.isAuth, headers),
            dataType: "json",
            responseType: "text",
            success: (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
              if (this.isSuccess(res)) {
                resolve(res);
              } else {
                console.error(
                  `url: ${url}, method: ${method}, headers: ${headers} encounter some errors, details: ${res.errMsg}`
                );
                reject(res);
              }
            },

            fail: (err: WechatMiniprogram.AccessFailCallbackResult) => {
              console.error(`Requset failed! ${url}`);
            },

            complete: (res: WechatMiniprogram.GeneralCallbackResult) => {
              console.log(`Request complete! ${url}`);
            },
          });
        }
      );
    }

    isSuccess(res: WechatMiniprogram.RequestSuccessCallbackResult): boolean {
      let statusCode = String(res.statusCode);
      return (
        !serverErrorPattern.test(statusCode) &&
        !clientErrorPattern.test(statusCode)
      );
    }

    /**
     * Request params append.
     */
    resolveParams(params?: Map<string, string>): string {
      if (params != null) {
        let paramsStr = "?";
        params.forEach((value, key) => {
          paramsStr += `${key}=${value}&`;
        });
        return paramsStr.substring(0, paramsStr.length - 1);
      }
      return "";
    }

    generateUrl(url: string, params?: Map<string, any>): string {
      return `${this.host}/api${url}${this.resolveParams(params)}`;
    }

    generateHeaders(isAuth: boolean, headers?: Map<string, any>): any {
      if (headers) {
        // add all
        this.headers = new Map([...this.headers, ...headers]);
      }
      if (app.auth) {
        this.headers.set('Authorization', `Bearer ${app.auth.accessToken}`);
      }
      return Object.fromEntries(this.headers);
    }
  }

  export function wechatLogin(userInfo: WechatMiniprogram.UserInfo, success: WechatMiniprogram.RequestSuccessCallback<any>) {
    wx.login({
      success: res => {
        if (res.code) {
          let data: API.WechatLoginVO = {
            userInfo: userInfo,
            jsCode: res.code
          }
          wx.request({
            url: `${Config.API_ROOT}${Config.LOGIN_URL}`,
            method: "POST",
            data: data,
            success: success
          });
        }
      }
    });
  }

  export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }
}
