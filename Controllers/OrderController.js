import Order from "../Models/OrderModel.js"




class OrderController {


  async getUserOrders(req,res,next) {
    try {
      const allUserOrders = await Order.find({"details.customerData.client.email": req.user.email})

      const ordersDto = {
        all: allUserOrders,
        active: allUserOrders.filter((item) => item.status.id !== 6).reverse(),
        finished: allUserOrders.filter((item) => item.status.id === 6)
      }

      return res.status(200).json(ordersDto.all.length < 1 ? {orders: null,message: 'Історія замовлень відсутня',success: false} : {orders: ordersDto,message: 'Ваші замовлення отримані',success: true}) 
    } catch (error) {
      next(error)
    }
  }
}



export default new OrderController()