import Order from "../Models/OrderModel.js"




class OrderController {


  async getUserOrders(req,res,next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5
      const page = req.query.page ? Number(req.query.page) : 1
      const skip = (page - 1) * limit || 0

      const allUserOrders = await Order.find({"details.customerData.client.email": req.user.email})
      const finishedOrders = await Order.find({"details.customerData.client.email": req.user.email,"status.id": {$gte: 6}}).limit(limit).skip(skip)
      const activeOrders = await Order.find({"details.customerData.client.email": req.user.email,"status.id": {$lt: 6}}).limit(limit).skip(skip)

      const finishedOrdersCount = await Order.countDocuments({"details.customerData.client.email": req.user.email,"status.id": {$gte: 6}}) 
      const activeOrdersCount = await Order.countDocuments({"details.customerData.client.email": req.user.email,"status.id": {$lt: 6}}) 

      const ordersDto = {
        all: allUserOrders,
        active: activeOrders,
        finished: finishedOrders
      }

      if(allUserOrders.length < 1) return res.status(304).json({orders: null,pagination: null,message: 'Історія замовлень відсутня',success: false})

      return res.status(200).json({orders: {...ordersDto,qty: {active: activeOrdersCount,finished: finishedOrdersCount,total: allUserOrders.length}},pagination: {page,limit,pageCount: {active: Math.ceil(activeOrdersCount / limit),finished: Math.ceil(finishedOrdersCount / limit)}},message: 'Ваші замовлення отримані',success: true}) 
    } catch (error) {
      next(error)
    }
  }

  async getUserActiveOrders(req,res,next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5
      const page = req.query.page ? Number(req.query.page) : 1
      const skip = (page - 1) * limit || 0

      const orderCount = await Order.countDocuments({"details.customerData.client.email": req.user.email,"status.id": {$lt: 6}})
      const activeOrders = await Order.find({"details.customerData.client.email": req.user.email,"status.id": {$lt: 6}}).limit(limit).skip(skip)
      
      if(activeOrders.length < 1) return res.status(200).json({success: true,message: 'У вас відсутні активні замовлення!',orders: null,pagination: null})
      return res.status(200).json({orders: activeOrders,pagination: {page,limit,pageCount: Math.ceil(orderCount / limit)},message: 'Активні замовлення отримані!',success: true}) 
    } catch (error) {
      next(error)
    }
  }
}



export default new OrderController()