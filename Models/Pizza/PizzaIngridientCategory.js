import mongoose from "mongoose";




const PizzaIngridientCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingridients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'PizzaIngridient',
  }
},{
  versionKey: false
})


export default mongoose.model('PizzaIngridientCategory',PizzaIngridientCategorySchema)