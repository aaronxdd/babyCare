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
    
    // 获取近7天的时间范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 6)
    
    // 查询近7天所有记录
    const result = await db.collection('records')
      .where({
        _openid: openid,
        time: _.gte(weekAgo).lt(today)
      })
      .get()
    
    const records = result.data
    
    // 按日期分组统计
    const dailyData = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayRecords = records.filter(r => {
        const recordDate = new Date(r.time).toISOString().split('T')[0]
        return recordDate === dateStr
      })
      
      let feedCount = 0
      let feedAmount = 0
      let poopCount = 0
      let urineCount = 0
      
      dayRecords.forEach(record => {
        if (record.type === 'feed') {
          feedCount++
          feedAmount += record.amount || 0
        } else if (record.type === 'poop') {
          poopCount++
        } else if (record.type === 'urine') {
          urineCount++
        }
      })
      
      dailyData.push({
        date: dateStr,
        feedCount,
        feedAmount,
        poopCount,
        urineCount
      })
    }
    
    return {
      success: true,
      dailyData
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
