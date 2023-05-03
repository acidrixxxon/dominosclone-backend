import ApiError from "./ApiError.js"



export const errorMiddleware = (err,res) => {
  
  if (err instanceof ApiError) {
   
    return res.status(err.status).json({message: err.message,success: false})
  }

  return res.status(500).json({message: err.message,success: false})
}