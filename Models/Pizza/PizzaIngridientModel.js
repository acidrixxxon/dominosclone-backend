import mongoose from "mongoose";


const PizzaIngridientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  addPrice: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PizzaIngridientCategory',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
},{
  versionKey: false
})


export default mongoose.model('PizzaIngridient',PizzaIngridientSchema)