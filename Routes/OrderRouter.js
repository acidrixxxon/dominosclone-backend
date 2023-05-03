import express from 'express'
import OrderController from '../Controllers/OrderController.js'
import authMiddleware from '../middlewares/auth-middleware.js'
import Order from '../Models/OrderModel.js'
import Stripe from 'stripe'
import ApiError from '../middlewares/ApiError.js'

const router = express.Router()
const stripe = Stripe('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')

router.post('/create',async (req,res) => {
  try {
    const { cart,details } = req.body
    if(!cart || !details) throw new ApiError(500,'Помилка! Відсутсні деталі замовлення!')

    const newOrder = await Order.create({cart,details})

    if (details.customerData.paymentType.id === 12312) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: newOrder.cart.items.map(item => ({
          price_data: {
            currency: "uah",
            product_data: {
              name: item.fulltitle,
              description: item.class === 0 && item.ingridients.length > 0 && 'Склад піцци: '+ item.ingridients.map((ingrid,index) => `${ingrid.ingridientId.title.toLowerCase()}${ingrid.qty > 1 ? '(подвійна)' : ''}${index + 1 == item.ingridients.length ? '' : ', '} `).join(' ')
            },
            unit_amount: item.price * 100
          },
          quantity: item.qty,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order/${newOrder._id}?paymentProcess=success`,
        cancel_url: `${process.env.FRONTEND_URL}/order/${newOrder._id}`,
      })
      
      const orderWithLink = {...newOrder._doc,details: {...newOrder._doc.details,customerData: {...newOrder._doc.details.customerData,paymentType: {...newOrder._doc.details.customerData.paymentType,paymentLink: session.url}}}}

      const updatedOrder = await Order.findByIdAndUpdate(newOrder._id,{ ...orderWithLink},{new: true})

      if (updatedOrder) return res.status(200).json({
        message: 'Нове замовлення створене!',
        success: true,
        order: updatedOrder
      })
    } else {
          if (newOrder) return res.status(200).json({
      message: 'Нове замовлення створене!',
      success: true,
      order: newOrder
    })
    }


  } catch (error) {
    console.log(error.message)

    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
})

router.get('/getuserorders',authMiddleware,OrderController.getUserOrders)

router.get('/:id',async (req,res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (order) return res.status(200).json({
      message: 'Замовлення знайдене!',
      success: true,
      order
    })
  } catch (error) {
    return res.status(500).json({
      errorMessage: error.nessage,
      success: false
    })
  }
})

router.get('/:id/payment-success',async (req,res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if(order._doc.details.customerData.paymentType.status && order._doc.details.customerData.paymentType.stage === 'замовлення сплачене') return res.status(200).json({ message: 'Замовлення вже сплачене',success: true,order})

    const updatedObj = {...order._doc,details: {...order._doc.details,customerData: {...order._doc.details.customerData,paymentType: {...order._doc.details.customerData.paymentType,stage: 'замовлення сплачене',status: true}}}}
    delete updatedObj.details.customerData.paymentType.paymentLink

    const updatedOrder = await Order.findByIdAndUpdate(order._doc._id,{...updatedObj},{new: true})
    
    return res.status(200).json({ message: 'Товар сплачено онлайн!',success: true,order: updatedOrder})
  } catch (error) {
    let message = error.message.includes('Cast to ObjectId failed for value') ? 'Не вдалось знайти замовлення за цим ID' : error.message

    return res.status(500).json({message,success: false})
  }
})

export default router