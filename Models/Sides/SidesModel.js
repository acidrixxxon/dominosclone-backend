import mongoose, { Schema } from "mongoose";




const SidesModel = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    minLength: 5,
    required: true
  },
  class: {
    type: Number,
    default: 1
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'SidesCategory',
    required: true
  },
  defaultPrice: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true
  },
  variants: [{
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true
    }
  }]
},{
  versionKey: false
})



export default mongoose.model('Sides',SidesModel)