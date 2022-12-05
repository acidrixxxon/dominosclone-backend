import ApiError from "./ApiError.js"
import jwt from 'jsonwebtoken'
import User from './../Models/UserModel.js'

const authMiddleware = async (req,res,next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
    
      if (!token) throw ApiError.MissingUserToken()
  
      jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,decoded) => {
        if (err) {
          return res.status(500).json({message: 'Не вдалось валідувати токен!',success: false})
        } else {
          const user = await User.findById(decoded._id).select('-password -confirmLink')
          if (!user) throw new ApiError(500,'Користувача по цьому токену не знайдено!')
          
          req.user = user
          next()
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