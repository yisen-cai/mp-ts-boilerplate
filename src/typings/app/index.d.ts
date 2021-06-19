/**
 * Stores all app related types.
 */
namespace App {
  interface AppOption extends IAppOption {
    // stores app user info
    user?: any;
    // stores authentication info
    auth?: API.AuthResult;
    globalData: {
      // stores wechat user info
      userInfo?: WechatMiniprogram.UserInfo;
    };
    loginReadyCallback?: Function;
    userInfoReadyCallback?: Function;
  }

  interface Config {
    API_ROOT?: string,
    OSS_ROOT?: string,
    OSS_BUCKET?: string,
    LOGIN_URL?: string
  }

  interface ConfigActive {
    ACTIVE: 'dev' | 'prod' | 'test' | ''
  }
}
