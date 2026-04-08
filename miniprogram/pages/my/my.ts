// pages/my/my.ts
Page({
  data: {
    babyName: '',
    birthDate: ''
  },

  onLoad() {
    const babyName = wx.getStorageSync('babyName') || ''
    const birthDate = wx.getStorageSync('birthDate') || ''
    this.setData({ babyName, birthDate })
  },

  onBabyNameChange(e: any) {
    this.setData({ babyName: e.detail.value })
    wx.setStorageSync('babyName', e.detail.value)
  },

  onBirthDateChange(e: any) {
    this.setData({ birthDate: e.detail.value })
    wx.setStorageSync('birthDate', e.detail.value)
  }
})
