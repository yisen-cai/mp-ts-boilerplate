import DevConfig from "./config-dev";
import ProdConfig from "./config-prod";
import TestConfig from "./config-test";


let Config: App.Config & App.ConfigActive = {
  API_ROOT: 'https://glancebar.com',
  OSS_ROOT: 'https://oss.yisen614.top',
  OSS_BUCKET: 'staff-test',
  LOGIN_URL: '/api/wechat/mini-program/login',
  ACTIVE: 'dev'
}


switch (Config.ACTIVE) {
  case 'dev':
    Object.assign(Config, DevConfig);
    break;
  case 'prod':
    Object.assign(Config, ProdConfig);
    break;
  case 'test':
    Object.assign(Config, TestConfig);
    break;
  default:
    break;
}



export default Config;