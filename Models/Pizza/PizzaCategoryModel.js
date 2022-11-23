import mongoose, { Schema } from "mongoose";

const PizzaCategoryModel = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minLength: 5
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Pizza'
  }
},{
  versionKey: false
})




export default mongoose.model('PizzaCategory',PizzaCategoryModel)