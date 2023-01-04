import ApiError from "../middlewares/ApiError.js"
import PizzaService from "../Services/PizzaService.js"



class PizzaController {

  async getPizzaById(req,res,next) {
    try {
      const { id } = req.params 
      if (!id) throw ApiError(500,'Ви не вказали id')

      const pizza = await PizzaService.getById(id)
      
      return res.status(200).json({message: 'Піццу знайдено',success: true,pizza})
    } catch (error) {
      next(error)
    }
    
  }

  async getIngridientsList(req,res,next) {
    try {
      const ingridients = await PizzaService.getAllIngridients()

      return res.status(200).json({message: '',success: true,ingridients})
    } catch (error) {
      next(error)
    }
  }
}


export default new PizzaController()