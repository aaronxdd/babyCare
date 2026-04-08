// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    
    // 获取今天的时间范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // 查询今日所有记录
    const result = await db.collection('records')
      .where({
        _openid: openid,
        time: _.gte(today).lt(tomorrow)
      })
      .get()
    
    const records = result.data
    
    // 统计
    let feedCount = 0
    let feedAmount = 0
    let poopCount = 0
    let urineCount = 0
    
    records.forEach(record => {
      if (record.type === 'feed') {
        feedCount++
        feedAmount += record.amount || 0
      } else if (record.type === 'poop') {
        poopCount++
      } else if (record.type === 'urine') {
        urineCount++
      }
    })
    
    return {
      success: true,
      feedCount,
      feedAmount,
      poopCount,
      urineCount
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
