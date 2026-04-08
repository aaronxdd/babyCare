// pages/feed/feed.ts - V2 对接云函数
Page({
  data: {
    amount: 120,
    duration: 15,
    method: 'bottle', // breast / bottle / mixed
    time: ''
  },

  onLoad() {
    this.setData({ time: this.formatTime(new Date()) })
  },

  formatTime(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },

  onAmountStep(e: any) {
    const type = e.currentTarget.dataset.type
    const delta = type === 'add' ? 10 : -10
    const newAmount = Math.max(0, this.data.amount + delta)
    this.setData({ amount: newAmount })
  },

  onDurationStep(e: any) {
    const type = e.currentTarget.dataset.type
    const delta = type === 'add' ? 5 : -5
    const newDuration = Math.max(0, this.data.duration + delta)
    this.setData({ duration: newDuration })
  },

  selectMethod(e: any) {
    this.setData({ method: e.currentTarget.dataset.method })
  },

  save() {
    const { amount, duration, method, time } = this.data
    
    wx.showLoading({ title: '保存中...' })

    // 确保云能力可用：避免 init / env 未配好导致的请求失败
    if (wx.cloud) {
      try {
        wx.cloud.init({ env: 'cloud1-5gi3t1xu65f8c95e', traceUser: true })
      } catch (e) {
        console.warn('wx.cloud.init failed', e)
      }
    }

    try {
      wx.cloud.callFunction({
        name: 'addRecord',
        data: {
          type: 'feed',
          time,
          amount,
          duration,
          method
        },
        success: (res) => {
          wx.hideLoading()
          const result = res.result
          if (result && typeof result === 'object') {
            wx.showToast({ title: '保存成功', icon: 'success' })
            // 更新首页缓存
            wx.removeStorageSync('todaySummary')
            setTimeout(() => wx.navigateBack(), 1500)
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' })
          }
        },
        fail: () => {
          wx.hideLoading()
          // 离线模式：存入本地缓存
          const records = wx.getStorageSync('records') || []
          records.unshift({ type: 'feed', amount, duration, method, time, id: Date.now() })
          wx.setStorageSync('records', records)
          wx.showToast({ title: '已本地保存', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1500)
        }
      })
    } catch (e) {
      wx.hideLoading()
      // 调用阶段直接失败时也兜底到本地
      const records = wx.getStorageSync('records') || []
      records.unshift({ type: 'feed', amount, duration, method, time, id: Date.now() })
      wx.setStorageSync('records', records)
      wx.showToast({ title: '已本地保存', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  }
})
