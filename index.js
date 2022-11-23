import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import PizzaRouter from './Routes/PizzaRouter.js'
import SidesRouter from './Routes/SidesRouter.js'
import DrinkRouter from './Routes/DrinkRouter.js'
import dotenv from 'dotenv'
import SidesCategory from './Models/Sides/SidesCategoryModel.js'
import Sides from './Models/Sides/SidesModel.js'
dotenv.config()

const app = express()


app.use(express.json())
app.use(cors())


app.use('/sides',SidesRouter)
app.use('/pizza',PizzaRouter)
app.use('/drinks',DrinkRouter)

const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {
  origin: "*",
  methods: ["GET", "POST"],
}})




httpServer.listen(3001,async () => {
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
    console.log(error)
  }
})