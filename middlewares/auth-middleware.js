import ApiError from "./ApiError.js"
import User from './../Models/UserModel.js'
import jwt, { decode } from 'jsonwebtoken'
import { errorMiddleware } from "./error-middleware.js"

const authMiddleware = async (req,res,next) => {
  try {
    if(!req.headers.authorization) throw ApiError.MissingUserToken()

    const token = req.headers.authorization.split(' ')[1]
    if (!token) throw ApiError.MissingUserToken()
  
    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,decoded) => {
      if(err) res.status(400).json({message: 'Токен не пройшов перевірку',success: false}) 
      
      if(decoded) User.findById(decoded._id).select('-password -confirmLink')
        .then(user => {
          req.user = user
          next()
        })
        .catch((err) => res.status(400).json({message: 'Користувача по цьому токену не знайдено!',success: false}))

    })
  } catch (error) {
    console.log('err',error.message)
    next(error)
  }
}

export default authMiddleware