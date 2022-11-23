import mongoose from "mongoose";



const DrinkCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Drink'
  }
},{
  versionKey: false
})





export default mongoose.model('DrinkCategory',DrinkCategorySchema)