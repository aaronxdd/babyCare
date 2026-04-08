// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { date, type, page = 1, pageSize = 20 } = event
  
  try {
    // 构建查询条件
    let query = {}
    
    // 日期筛选
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.time = _.gte(startDate).lt(endDate)
    }
    
    // 类型筛选
    if (type && type !== 'all') {
      query.type = type
    }
    
    // 获取 openid
    const wxContext = cloud.getWXContext()
    query._openid = wxContext.OPENID
    
    // 查询总数
    const countResult = await db.collection('records')
      .where(query)
      .count()
    
    // 查询列表
    const listResult = await db.collection('records')
      .where(query)
      .orderBy('time', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      list: listResult.data,
      total: countResult.total
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
