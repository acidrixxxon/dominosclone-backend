import ApiError from "./ApiError.js"



export const errorMiddleware = (err,req,res,next) => {

  if (err instanceof ApiError) {
   
    return res.status(err.status).json({message: err.message,errors: err.errrors,success: false})
  }

  return res.status(500).json({errorMessage: err.message,statusCode: 500})
}