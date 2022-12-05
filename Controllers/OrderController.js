import Order from "../Models/OrderModel.js"




class OrderController {


  async getUserOrders(req,res,next) {
    try {
      const userOrders = await Order.find({email: req.user.email})

      return res.status(200).json({message: 'Ваші замовлення отримані',success: true,orders: userOrders})
    } catch (error) {
      next(error)
    }
  }
}



export default new OrderController()