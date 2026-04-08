// pages/urine/urine.ts
Page({
  data: {
    amountLevel: 'medium', // little / medium / much
    time: ''
  },

  onLoad() {
    this.setData({ time: this.formatTime(new Date()) })
  },

  formatTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },

  selectAmount(e: any) {
    this.setData({ amountLevel: e.currentTarget.dataset.level })
  },

  save() {
    const { amountLevel, time } = this.data
    wx.cloud.callFunction({
      name: 'addRecord',
      data: { type: 'urine', time, amountLevel },
      success: () => {
        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      },
      fail: () => {
        const records = wx.getStorageSync('records') || []
        records.unshift({ type: 'urine', amountLevel, time, id: Date.now() })
        wx.setStorageSync('records', records)
        wx.showToast({ title: '已本地保存', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      }
    })
  }
})
