import User from '../Models/UserModel.js'
import UserDto from '../Dto/UserDto.js'
import jwt from 'jsonwebtoken'

class TokenService {

  async generateTokens(data) {
    const accessToken = jwt.sign(data,process.env.JWT_SECRET_KEY,{
      expiresIn: '30m'
    })
     
    const refreshToken = jwt.sign(data,process.env.JWT_SECRET_KEY,{
      expiresIn: '30d'
    })
  
    return {
      accessToken,
      refreshToken
    }
  }

  async refreshTokens(id) {
   try {
    const user = await User.findById(id)
    if(!user) throw new ApiError(500,'Користувача не знайдено')

    const userDto = new UserDto(user)

    const accessToken = jwt.sign({...userDto},process.env.JWT_SECRET_KEY,{
      expiresIn: '2h'
    })
     
    const refreshToken = jwt.sign({...userDto},process.env.JWT_SECRET_KEY,{
      expiresIn: '30d'
    })


    return {
      ...userDto,
      tokens: {
        accessToken,refreshToken
      }
    }
    
   } catch (error) {
    console.log(error)
   }
  }

}


export default new TokenService()