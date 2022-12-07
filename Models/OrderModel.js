import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  cart: {
    items: [],
    totalCost: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },
  details: {

  },
  status: {
    id: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: 'Прийнят'
    }
  }
},{
  versionKey: false,
  timestamps: true
})




export default mongoose.model('Order', OrderSchema)