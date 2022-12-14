import { Router } from "express";
import Pizza from './../Models/Pizza/PizzaModel.js'
import Side from './../Models/Sides/SidesModel.js'
import Drinks from './../Models/Drinks/DrinkModel.js'

const router = Router()


router.get('/',async (req,res) => {
  let productName = req.query.name
  let result = []

  if (!productName) return res.status(500).json({message: 'Відстуні параметри пошуку',success: false})

  const pizza = await Pizza.find({"title": { "$regex": productName, "$options": "i" }}).populate({path: 'ingridients',populate: {path: 'ingridientId'}})
  const sides = await Side.find({"title": { "$regex": productName, "$options": "i" }})
  const drinks = await Drinks.find({"title": { "$regex": productName, "$options": "i" }})


  if (pizza.length > 0 || sides.length > 0 || drinks.length > 0) {
    result = [...result,...pizza,...sides,...drinks]

    return res.status(200).json({
      message: 'Пошук виконано!',
      success: true,
      result
    })
  }
  

  return res.status(404).json({
    message: 'Нічого не вдалось знайти!',
    success: false,
  })
})


export default router