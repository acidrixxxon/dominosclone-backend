import mongoose, { Schema } from "mongoose";




const SidesCategoryModel = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minLength: 5
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Sides'
  }
},{
  versionKey: false
})




export default mongoose.model('SidesCategory',SidesCategoryModel)