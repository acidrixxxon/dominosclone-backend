import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import Stripe from 'stripe'
import ApiError from './middlewares/ApiError.js'
import { errorMiddleware } from './middlewares/error-middleware.js'
import Order from './Models/OrderModel.js'
import SidesCategory from './Models/Sides/SidesCategoryModel.js'
import Sides from './Models/Sides/SidesModel.js'
import DrinkRouter from './Routes/DrinkRouter.js'
import OrderRouter from './Routes/OrderRouter.js'
import PizzaRouter from './Routes/PizzaRouter.js'
import SearchRouter from './Routes/SearchRouter.js'
import SidesRouter from './Routes/SidesRouter.js'
import UserRouter from './Routes/UserRouter.js'
import AnalyticsRouter from './Routes/AnalyticsRouter.js'
dotenv.config()

const app = express()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)


app.use(express.json())
app.use(cors())

app.get('/payment/:id',async (req,res) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)
    console.log(order)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: order.cart.items.map(item => ({
        price_data: {
          currency: "uah",
          product_data: {
            name: item.fulltitle
          },
          unit_amount: item.price * 100
        },
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/${id}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/${id}/?paymentProcess=success`,
    })

    res.json({url: session.url})
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
})
app.use('/sides',SidesRouter)
app.use('/pizza',PizzaRouter)
app.use('/drinks',DrinkRouter)
app.use('/order',OrderRouter)
app.use('/user',UserRouter)
app.use('/search',SearchRouter)
app.use('/analytics',AnalyticsRouter)
app.use(errorMiddleware)

const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {
  origin: "*",
  methods: ["GET", "POST"],
}})




httpServer.listen(process.env.PORT || 3000,async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      console.log('Server has been started and MONGODB connected!')

      io.on('connection',(socket) => {

        SidesCategory.watch().on('change',async (data) => {
          const allCategories = await  SidesCategory.find({})
          if(allCategories) socket.emit('sides_category_change',allCategories)
        })

        Sides.watch().on('change',async (data) => {
          const allCategories = await  SidesCategory.find({}).populate('products')
          if(allCategories) socket.emit('sidesCategories_change',allCategories)
        })
      })
    })

  } catch (error) {
    console.log(error.message)
  }
})