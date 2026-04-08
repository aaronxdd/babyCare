// pages/poop/poop.ts
Page({
  data: {
    color: 'yellow', // yellow / green / other
    shape: 'normal', // loose / normal / dry
    time: ''
  },

  onLoad() {
    this.setData({ time: this.formatTime(new Date()) })
  },

  formatTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },

  selectColor(e: any) {
    this.setData({ color: e.currentTarget.dataset.color })
  },

  selectShape(e: any) {
    this.setData({ shape: e.currentTarget.dataset.shape })
  },

  save() {
    const { color, shape, time } = this.data
    wx.cloud.callFunction({
      name: 'addRecord',
      data: { type: 'poop', time, color, shape },
      success: () => {
        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      },
      fail: () => {
        const records = wx.getStorageSync('records') || []
        records.unshift({ type: 'poop', color, shape, time, id: Date.now() })
        wx.setStorageSync('records', records)
        wx.showToast({ title: '已本地保存', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      }
    })
  }
})
