import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  cart: {
    items: [],
    totalCost: {
      type: Number,
      required: true,
      min: 50
    },
    totalCount: {
      type: Number,
      required: true,
      min: 1
    }
  },
  details: {
    orderType: {},
    customerData: {
      details: {},
      client: {
        name: {
          type: String,
          required: true,
          minlength: 4
        },
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        }
      },
      paymentType: {}
    },
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