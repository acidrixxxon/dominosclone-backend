
import UserService from "../Services/UserService.js"
import ApiError from "../middlewares/ApiError.js"
import TokenService from "../Services/TokenService.js"

class UserController {

  async loginUser(req,res) {
    try {
      const { email,password } = req.body
      const user = await UserService.login(email,password)

      res.status(200).json({message: 'Авторизований!',success: true,user})
    } catch (error) {
      res.status(error.status).json({message: error.message,success: error.success})
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
      const data = req.body
      if(!data) throw new ApiError(500,'Відсутні дані для оновлення')

      const user = await UserService.updateProfile(req.user._id,data)

      return res.status(200).json({success: true,message: 'Дані успішно оновлені',user})
      
    } catch (error) {
      res.status(error.status).json({message: error.message,success: error.success})
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