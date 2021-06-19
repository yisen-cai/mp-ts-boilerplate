// logs.ts
// const util = require('../../utils/util.js')
import { formatTime } from '../../utils/util'
import Notify from '@vant/weapp/notify/notify';

Page({
  data: {
    logs: [],
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map((log: string) => {
        return {
          date: formatTime(new Date(log)),
          timeStamp: log
        }
      }),
    });
  },

  onReachBottom() {
    Notify({type: 'danger', message: '创建测评失败!'});
  }
})
