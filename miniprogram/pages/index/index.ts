// pages/index/index.ts - V2 对接云函数
Page({
  data: {
    summary: {
      feedCount: 0,
      feedAmount: 0,
      poopCount: 0,
      urineCount: 0
    }
  },

  onLoad() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-5gi3t1xu65f8c95e',
        traceUser: true,
      })
    }
  },

  onShow() {
    this.loadTodaySummary()
  },

  loadTodaySummary() {
    try {
      wx.cloud.callFunction({
        name: 'getTodaySummary',
        success: (res) => {
          const result = res.result
          if (result && typeof result === 'object' && (result as any).success) {
            const r = result as any
            const todaySummary = {
              feedCount: Number(r.feedCount ?? 0),
              feedAmount: Number(r.feedAmount ?? 0),
              poopCount: Number(r.poopCount ?? 0),
              urineCount: Number(r.urineCount ?? 0)
            }
            this.setData({ summary: todaySummary })
            // 同步到本地缓存
            wx.setStorageSync('todaySummary', todaySummary)
          }
        },
        fail: () => {
          // 降级到本地缓存
          const cache = wx.getStorageSync('todaySummary')
          if (cache) {
            this.setData({ summary: cache as any })
          }
        }
      })
    } catch (e) {
      // 调用阶段直接失败时也兜底
      const cache = wx.getStorageSync('todaySummary')
      if (cache) {
        this.setData({ summary: cache as any })
      }
    }
  },

  goToFeed() {
    wx.navigateTo({ url: '/pages/feed/feed' })
  },

  goToPoop() {
    wx.navigateTo({ url: '/pages/poop/poop' })
  },

  goToUrine() {
    wx.navigateTo({ url: '/pages/urine/urine' })
  }
})
