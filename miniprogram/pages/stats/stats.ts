// pages/stats/stats.ts
Page({
  data: {
    period: 'today', // today / week / month
    summary: {
      feedCount: 0,
      feedAmount: 0,
      poopCount: 0,
      urineCount: 0
    },
    weekData: []
  },

  onLoad() {
    this.loadSummary()
  },

  onShow() {
    this.loadSummary()
  },

  loadSummary() {
    const cache = wx.getStorageSync('todaySummary')
    if (cache) {
      this.setData({ summary: cache })
    }

    const weekData = wx.getStorageSync('weekData') || []
    this.setData({ weekData })
  },

  switchPeriod(e: any) {
    this.setData({ period: e.currentTarget.dataset.period })
    // 切换时期，重新加载数据
  }
})
