import ApiError from "./ApiError.js"
import User from './../Models/UserModel.js'
import jwt from 'jsonwebtoken'

const authMiddleware = async (req,res,next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
    
      if (!token) throw ApiError.MissingUserToken()
  
      jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,decoded) => {
        if (err) {
          return res.status(500).json({message: 'Не вдалось валідувати токен!',success: false})
        } else {
          User.findById(decoded._id).select('-password -confirmLink')
            .then((user) => {
              if (!user) return res.status(500).json({message: 'Користувача по цьому токену не знайдено!',success: false}) 
              
              req.user = user
              next()
            })
            .catch(error => next(error))
        }
      })
    } else {
      throw ApiError.MissingUserToken()
    } 
  } catch (error) {
    next(error)
  }
}

export default authMiddleware