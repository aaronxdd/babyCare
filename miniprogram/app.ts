// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化云开发：避免其它页面直接调用 wx.cloud.callFunction 失败
    if (wx.cloud) {
      try {
        wx.cloud.init({ env: 'cloud1-5gi3t1xu65f8c95e', traceUser: true })
      } catch (e) {
        // 初始化失败时后续会走各页面的 fail 回退到本地存储
        console.warn('wx.cloud.init failed', e)
      }
    }

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})