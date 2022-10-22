import mongoose from "mongoose"


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
    type: Number,
    default: 0
  },
  class: {
    type: Number,
    required: true
  },
  defaultPrice: {
    type: Number,
    required: true
  },
  ingridients: [{id: {type: Number,required: true},qty: {type: Number,required: true}}],
  variants: [
    {
      title: { 
        type: String,
        required: true
      },
      variants: [{
        id: {
          type: Number,
          required: true
        },
        isSell: {
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
})




export default mongoose.model('Pizza', pizzaSchema)