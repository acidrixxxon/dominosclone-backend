import { Router } from "express";
import Pizza from "../Models/PizzaModel.js";

const router = Router()


router.post('/add_new',async (req,res) => {
  try {
    const productClass = req.body.class
    
    console.log(req.body.variants)
    if(productClass === undefined) return res.status(400).json({status: 'error',message: 'Не вказаний тип продукту!'})
  
    if (productClass === 0) {
      const newProduct = await Pizza.create({
        class: productClass,
        image: req.body.image,
        rating: req.body.rating,
        category: req.body.category,
        defaultPrice: req.body.defaultPrice,
        title: req.body.title,
        fullimageUrl: req.body.fullimageUrl,
        imageUrl: req.body.imageUrl,
        variants: req.body.variants,
        ingridients: req.body.ingridients})
    }
    
    res.status(200).json({message: 'da'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
})




export default router