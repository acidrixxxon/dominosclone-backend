import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import Pizza from './Models/PizzaModel.js'
import ProductRouter from './Routes/ProductRouter.js'
import SidesRouter from './Routes/SidesRouter.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()


app.use(express.json())
app.use(cors())

app.use('/product/',ProductRouter)
app.use('/sides',SidesRouter)

const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {
  origin: "*",
  methods: ["GET", "POST"],
}})




httpServer.listen(3001,async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      console.log('Server has been started!')

      io.on('connection',(socket) => {

        Pizza.watch().on('change',(data) => {
          socket.emit('db_change',data)
        })
      })
    })

  } catch (error) {
    console.log(error)
  }
})