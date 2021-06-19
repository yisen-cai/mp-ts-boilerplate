
type ExamplePageData = {
  userInfo?: WechatMiniprogram.UserInfo,
  hasUserInfo: boolean,
  svgSrc: string,
  canIUseGetUserProfile: boolean
}

Page<ExamplePageData, WechatMiniprogram.Page.CustomOption>({
  data: {
    svgSrc: '',
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad() {
    this.setData({
      canIUseGetUserProfile: true
    });
    // const fileManager = wx.getFileSystemManager();
    // wx.downloadFile({
    //   url:
    //     'https://cdn.thickinto.com/rdo/mall/ticket/673f1b5d1c9b36966eb4a7fbf8d19971/just.svg',
    //   success: ({ tempFilePath }) => {
    //     let fileData = fileManager.readFileSync(tempFilePath, 'base64');
    //     this.setData({
    //       svgSrc: `data:image/svg+xml;base64,${fileData}`
    //     });
    //   }
    // });
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        console.log(res);
      }
    });
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})