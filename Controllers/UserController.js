import User from "../Models/UserModel.js"
import UserService from "../Services/UserService.js"
import lodash from 'lodash'
import ApiError from "../middlewares/ApiError.js"
import UserDto from "../Dto/UserDto.js"
import TokenService from "../Services/TokenService.js"

class UserController {

  async loginUser(req,res,next) {
    try {
      const { email,password } = req.body
      const user = await UserService.login(email,password)

      return res.status(200).json({message: 'Авторизований!',success: true,user})
    } catch (error) {
      next(error)
    }
  }

  async registerUser(req,res,next) {
    try {
      const { email,password } = req.body

      const newUser = await UserService.registration({email,password})
      
      if (newUser) return res.status(200).json({
        message: 'Користувач зареєстрований!',
        success: true,
        user: newUser
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req,res,next) {
    try {
      const { data } = req.body
      if (!data || lodash.isEmpty(data)) throw new ApiError(500,'Відсутні дані для оновлення')
      
      const updatedUser = await User.findByIdAndUpdate(req.user._id,data)
      if(!updatedUser) throw new ApiError(500,'Не вдалось оновити профайл!')

      const user = await User.findById(updatedUser._id).select('-password -confirmLink')
      
      if(user) {
        return res.status(200).json({success: true,message: 'Дані успішно оновлені',user})
      }
    } catch (error) {
      next(error)
    }
  }

  async activateAccount(req,res,next) {
    try {
      const { link } = req.params
      
      const user = await UserService.activateAccount(link)
      return res.redirect(`${process.env.FRONTEND_URL}/?authmodal=active`)
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req,res,next) {
    try {
      const data = await TokenService.refreshTokens(req.user._id)
      if(!data) throw new ApiError(500,'Не вдалось оновити токен!')

      return res.status(200).json({message: 'Новий токен отримано',success: true,user: data})

    } catch (error) {
      next(error)
    }
  }
}



export default new UserController()