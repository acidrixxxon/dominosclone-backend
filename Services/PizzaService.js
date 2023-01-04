import ApiError from "../middlewares/ApiError.js"
import PizzaIngridientCategory from "../Models/Pizza/PizzaIngridientCategory.js"
import Pizza from "../Models/Pizza/PizzaModel.js"





class PizzaService {

  async getById(id) {
    try {
      const pizza = await Pizza.findById(id).populate({path: 'ingridients',populate: {path: 'ingridientId'}})
  
      return pizza
    } catch (error) {
      throw new ApiError(500,'Піццу не знайдено!')
    }
  }

  async getAllIngridients() {
    const ingridients = await PizzaIngridientCategory.find({}).populate('ingridients')

    return ingridients
  }
}


export default new PizzaService()