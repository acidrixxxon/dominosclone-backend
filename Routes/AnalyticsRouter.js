import express from 'express'
import authMiddleware from './../middlewares/auth-middleware.js'
import OrderModel from '../Models/OrderModel.js'
import moment from 'moment/moment.js'

const router = express.Router()

router.get('/',authMiddleware,async (req,res) => {
  try {
    let timeQuery = req.query.time ? req.query.time : 'month'
    
    const currentDate = moment().format('YYYY-MM-DD')

    const currentYear = moment().year()
    const currentMonth = moment().month()

    const month = {
      startDate: moment([currentYear,currentMonth,1]).format('YYYY-MM-DD'),
      endDate: currentDate
    }

    const year = {
      startDate: moment([currentYear,0,1]).format('YYYY-MM-DD'),
      endDate: moment([currentYear,11,31]).format('YYYY-MM-DD')
    }

    const dateRange = timeQuery === 'year' ? year : month

    const userOrders = await OrderModel.find({"details.customerData.client.email": req.user.email,createdAt: { $gte: dateRange.startDate }})


    if(userOrders.length > 0) {
      let analytics = {
        date: {
          title: timeQuery,
          from: dateRange.startDate,
          to: dateRange.endDate
        },
        orderCount: userOrders.length,
        moneySpent: userOrders.reduce((prev,next) =>prev + next.cart.totalCost,0),
        deliveriesCount: userOrders.filter(item => item.details.orderType.id == 0).length,
        dineInCount: userOrders.filter(item => item.details.orderType.id == 1).length,
      }
  
      return res.status(200).json({
        success: true,
        message: 'Аналітику отримано!',
        analytics,
      })
    } else {
      return res.status(200).json({
        message: 'Не вдалось отримати аналітику',
        success: false,
        analytics: null
      })
    }
    
  } catch (error) {
    console.log(error)
    res.status(error.status).json({message: error.message,success: error.success})
  }
})


export default router