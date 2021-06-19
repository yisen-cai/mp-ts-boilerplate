import Notify from '@vant/weapp/notify/notify';
import { Network } from '../../utils/network';

const app = <App.AppOption>getApp();

type LoginPageData = {
  userInfo?: WechatMiniprogram.UserInfo,
  readed: boolean
};

Page<LoginPageData, WechatMiniprogram.Page.CustomOption>({
  data: {
    readed: false
  },

  onLoad() {

  },

  readedAgreementAction(event: any) {
    this.setData({
      readed: !this.data.readed
    });
  },

  getUserProfile(event: any) {
    let self = this;
    if (this.data.readed) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          self.loginAction(res);
        },
        fail: (err) => {
          console.log(err);
        }
      });
    } else {
      Notify({ type: 'primary', message: '请阅读并勾选用户协议!' });
    }
  },

  loginAction(result: WechatMiniprogram.GetUserProfileSuccessCallbackResult) {
    this.setData({
      userInfo: result.userInfo,
      hasUserInfo: true
    });
    Network.wechatLogin(result.userInfo, res => {
      // stores authentication info
      let loginResult = <API.WechatAuthResult>res.data;
      app.auth = loginResult.auth;
      app.user = loginResult.user;
      wx.setStorageSync("Authorization", `Bearer ${app.auth.accessToken}`);
      wx.setStorageSync("expiration", app.auth.expiration);
      wx.setStorageSync("user", result.userInfo);
      wx.navigateBack();
    });
  }
});