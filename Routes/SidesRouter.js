import express from 'express'
import SidesCategory from '../Models/SidesCategoryModel.js'
import Sides from '../Models/SidesModel.js'


const router = express.Router()


router.post('/add_category',async (req,res) => {
  try {
    const { title } = req.body

    const newCategory = await SidesCategory.create({title})
  
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
    const data = await SidesCategory.find({})


    if (data.length > 0) return res.status(200).json({
      message: 'Категорія успішно отримані!',
      status: true,
      categories: data
    })

    if (data.length === 0 ) return res.status(200).json({
      message: 'Нажаль категорій не знайдено!',
      success: false
    })
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})


router.post('/add_product',async (req,res) => {
  try {
    const { title,imageUrl,category,variants,defaultPrice } = req.body

    const newProduct = await Sides.create({
      title,imageUrl,defaultPrice,class: req.body.class,variants,category
    })


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
    const products = await Sides.find({})

    if (products.length > 0) return res.status(200).json({
      message: 'Усі сайди отримані!',
      success: true,
      products
    })
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

export default router