import express from 'express'
import DrinkCategory from '../Models/Drinks/DrinkCategoryModel.js'
import Drink from '../Models/Drinks/DrinkModel.js'

const router = express.Router()


router.post('/add_category',async (req,res) => {
  try {
    const { title } = req.body

    const newCategory = await DrinkCategory.create({title})
  
    if (newCategory) return res.status(200).json({
      message: 'Категорія успішно добавлена!',
      status: true,
      category: newCategory
    })  
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.get('/get_allcategories',async (req,res) => {
  try {
    const products = await DrinkCategory.find({}).populate('products')

    if (products) return res.status(200).json({
      message: 'Категорії напоїв отримані!',
      success: true,
      categories: products
    })  
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.post('/add_product',async (req,res) => {
  try {
    const { title,imageUrl,defaultPrice,category,variants,rating } = req.body
        
    const newProduct = await Drink.create({
      title,imageUrl,defaultPrice,class: req.body.class,variants,category,rating
    })

    const drinkCategory = await DrinkCategory.findById({_id: category})
    if (!drinkCategory) return res.status(500).json({message: 'Категорія не знайдена',success: false})

    await DrinkCategory.findByIdAndUpdate(drinkCategory._id,{products: [...drinkCategory.products,newProduct._id]})

    if (newProduct) return res.status(200).json({
      message: 'Продукт успішно добавлен!',
      status: true,
      product: newProduct
    })  
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.get('/get_allproducts',async (req,res) => {
  try {
    const { sort } = req.query
    
    if (sort === '0') {
      const data = await Drink.find({}).sort([['rating',-1]])

      if (data.length > 0) return res.status(200).json({
        message: 'Продукти успішно отримані!',
        success: true,
        products: data
      })
    } else if (sort === '1') {
      const data = await Drink.find({}).sort([['defaultPrice',-1]])

      if (data.length > 0) return res.status(200).json({
        message: 'Продукти успішно отримані!',
        success: true,
        products: data
      })
    } else {
      const data = await Drink.find({}).sort([['defaultPrice',1]])

      if (data.length > 0) return res.status(200).json({
        message: 'Продукти успішно отримані!',
        success: true,
        products: data
      })
    }

  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

export default router