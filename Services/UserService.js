import User from "../Models/UserModel.js"
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import MailService from "./MailService.js"
import ApiError from "../middlewares/ApiError.js"
import UserDto from "../Dto/UserDto.js"
import TokenService from "./TokenService.js"



class UserService {

  async login(email,password) {
    if (!email || !password ) throw new ApiError(500,'Заповніть все поля!')

    const user = await User.findOne({email})
    if(!user) throw new ApiError(500,'Користувача з таким email не знайдено!')

    if(!user.confirmed) throw ApiError.UserAccountNotActivated()

    const comparePassword = await bcrypt.compare(password,user.password)
    if (!comparePassword) throw new ApiError(500,'Ви ввели невірний пароль!')

    const userDto = new UserDto(user)
    const tokens = await TokenService.generateTokens({...userDto})
    
    return {
      ...userDto,
      tokens
    }
  }

  async registration(user) {
      const { email,password } = user

      if (!email || !password) throw new ApiError(500,'Ви не ввели данні') 

      const existUser = await User.findOne({ email })

      if (existUser) throw new ApiError(500,'Користувач з таким email вже існує') 

      const hashedPassword = await bcrypt.hash(password,2)
      const confirmLink = v4()

      const newUser = await User.create({email,password: hashedPassword,confirmLink})
      await MailService.sendActivationMail(newUser.email,newUser.confirmLink)

      if(newUser) {
        const user = await User.findById(newUser._id).select('-password')
        if (user) return user
      }
  }

  async activateAccount(link) {
      const user = await User.findOne({confirmLink: link }).select('-password')
      if(!user) throw ApiError.BadRequest('Користувача не знайдено')

      user.confirmed = true
      const updatedUser = await user.save()

      if(updatedUser) return updatedUser
  }
}






export default new UserService()


