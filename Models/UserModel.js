import mongoose from 'mongoose'



const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmLink: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  secondName: {
    type: String,
    default: ''
  },
  isAdmin: {type: Boolean,default: false}
},{
  versionKey: false
})



export default mongoose.model('User',UserSchema)