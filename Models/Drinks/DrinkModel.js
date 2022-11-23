import mongoose from "mongoose";



const DrinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  defaultPrice: {
    type: Number,
    required: true
  },
  newProduct: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 3
  },
  class: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DrinksCategories',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  variants: [{
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }]
},{
  versionKey: false
})





export default mongoose.model('Drink',DrinkSchema)