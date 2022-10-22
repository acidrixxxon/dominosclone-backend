import mongoose from "mongoose";




const SidesCategoryModel = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minLength: 5
  }
},{
  versionKey: false
})




export default mongoose.model('SidesCategory',SidesCategoryModel)