import express from 'express'
import DrinkCategory from '../Models/Drinks/DrinkCategoryModel.js'
import Drink from '../Models/Drinks/DrinkModel.js'
import Order from '../Models/OrderModel.js'

const router = express.Router()

router.post('/create',async (req,res) => {
  try {
    const { order: { cart,details }} = req.body

    const newOrder = await Order.create({cart,details})
    
    if (newOrder) return res.status(200).json({
      message: 'Нове замовлення створене!',
      success: true,
      order: newOrder
    })
  } catch (error) {
    console.log(error.message)

    return res.status(500).json({
      errorMessage: error.nessage,
      success: false
    })
  }
})

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

export default router