// pages/history/history.js
Page({
  data: {
    records: [],
    selectedDate: '',
    selectedType: 'all' // all / feed / poop / urine
  },

  onLoad() {
    this.setData({ selectedDate: this.formatDate(new Date()) })
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  },

  loadRecords() {
    const records = wx.getStorageSync('records') || []
    this.setData({ records })
  },

  onDateChange(e) {
    this.setData({ selectedDate: e.detail.value })
  },

  onTypeChange(e) {
    this.setData({ selectedType: e.currentTarget.dataset.type })
  }
})

