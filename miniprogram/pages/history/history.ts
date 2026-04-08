// pages/history/history.ts
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

  formatDate(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  },

  loadRecords() {
    const records = wx.getStorageSync('records') || []
    this.setData({ records })
  },

  onDateChange(e: any) {
    this.setData({ selectedDate: e.detail.value })
  },

  onTypeChange(e: any) {
    this.setData({ selectedType: e.currentTarget.dataset.type })
  },

  getTypeIcon(type: string) {
    const map = { feed: '🍼', poop: '💩', urine: '💧' } as const
    return type in map ? map[type as keyof typeof map] : '❓'
  },

  getTypeLabel(type: string, record: any) {
    if (type === 'feed') return `喂奶 ${record.amount}ml / ${record.duration}分钟`
    if (type === 'poop') return `拉屎 ${record.color} / ${record.shape}`
    if (type === 'urine') return `撒尿 ${record.amountLevel}`
    return ''
  }
})
