// pages/index/index.ts
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
    this.loadTodaySummary()
  },

  onShow() {
    this.loadTodaySummary()
  },

  loadTodaySummary() {
    // 模拟数据，实际从云函数获取
    const cache = wx.getStorageSync('todaySummary')
    if (cache) {
      this.setData({ summary: cache })
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
