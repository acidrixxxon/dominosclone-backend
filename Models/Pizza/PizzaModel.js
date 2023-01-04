import mongoose, { Schema } from "mongoose"


const pizzaSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  fullimageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PizzaCategory',
    required: true
  },
  class: {
    type: Number,
    required: true
  },
  defaultPrice: {
    type: Number,
    required: true
  },
  ingridients: [
    {
      ingridientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PizzaIngridient',
        required: true
      },
      qty: {
        type: Number,
        required: true
      }
    }
  ],
  aNewOne: {
    type: Boolean,
    default: false
  },
  variants: [
    {
      title: { 
        type: String,
        required: true
      },
      variants: [{
        inSell: {
          type: Boolean,
          default: true
        },
        fulltitle: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }]
    }]
},{
  versionKey: false
})




export default mongoose.model('Pizza', pizzaSchema)