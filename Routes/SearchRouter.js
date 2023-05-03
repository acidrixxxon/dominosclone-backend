import { Router } from "express";
import Pizza from './../Models/Pizza/PizzaModel.js'
import Side from './../Models/Sides/SidesModel.js'
import Drinks from './../Models/Drinks/DrinkModel.js'

const router = Router()


router.get('/',async (req,res,next) => {
  try {
    const productName = req.query.name
    let result = []
    const limit = req.query.limit ? Number(req.query.limit) : 3
    const pageNumber = req.query.page ? Number(req.query.page) : 1
    let lastIndex
    let firstIndex
    let pagesCount
  
    if (!productName) return res.status(500).json({message: 'Відстуні параметри пошуку',success: false})
  
    const pizza = await Pizza.find({"title": { "$regex": productName, "$options": "i" }}).populate({path: 'ingridients',populate: {path: 'ingridientId'}})
    const sides = await Side.find({"title": { "$regex": productName, "$options": "i" }})
    const drinks = await Drinks.find({"title": { "$regex": productName, "$options": "i" }})
  
  
    if (pizza.length > 0 || sides.length > 0 || drinks.length > 0) {
      result = [...result,...pizza,...sides,...drinks]
  
      firstIndex = (pageNumber - 1) * limit
      lastIndex = firstIndex + limit
      pagesCount = Math.ceil(result.length / limit)
      
      const paginatedArray = result.slice(firstIndex,lastIndex)
  
      return res.status(200).json({
        message: 'Пошук виконано!',
        success: true,
        pagination: {
          limit,
          page: pageNumber,
          pagesCount
        },
        result: paginatedArray
      })
    }
    
  
    return res.status(404).json({
      message: 'Нічого не вдалось знайти!',
      success: false,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id',async (req,res,next) => {
  try {
    const id = req.params.id
    let result;

    const pizza = await Pizza.findById(id).populate({path: 'ingridients',populate: {path: 'ingridientId'}})
    if(pizza) {
      result = pizza

      return res.status(200).json({
        message: 'da',
        success: true,
        result
      })
    }
    
    const side = await Side.findById(id)
    if(side) {
      result = side

      return res.status(200).json({
        message: 'da',
        success: true,
        result
      })
    }

    const drink = await Drinks.findById(id)
    if(drink) {
      result = drink

      return res.status(200).json({
        message: 'Продукт отримано!',
        success: true,
        product: result
      })
    }
  } catch (error) {
    next(error)
  }
})


export default router