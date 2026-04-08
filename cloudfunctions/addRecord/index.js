// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, time, amount, duration, method, color, shape, amountLevel } = event
  
  try {
    const result = await db.collection('records').add({
      data: {
        type,
        time: new Date(time),
        amount: amount || null,
        duration: duration || null,
        method: method || null,
        color: color || null,
        shape: shape || null,
        amountLevel: amountLevel || null,
        createdAt: db.serverDate()
      }
    })
    
    return {
      success: true,
      id: result._id
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
