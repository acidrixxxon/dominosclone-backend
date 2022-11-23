import express from 'express'
import SidesCategory from '../Models/Sides/SidesCategoryModel.js'
import Sides from '../Models/Sides/SidesModel.js'


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
    const data = await SidesCategory.find({}).populate('products')


    if (data.length > 0) return res.status(200).json({
      message: 'Категорія успішно отримані!',
      success: true,
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

router.post('/remove_category',async (req,res) => {
  try {
    const { categoryId } = req.body
    if (!categoryId) return res.status(500).json({message: 'Відсутній id категорії',status: false})

    const result = await SidesCategory.findByIdAndRemove(categoryId)

    if (result) return res.status(200).json({
      message: 'Категорія успішно видалена!',
      success: true,
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

    const sideCategory = await SidesCategory.findById({_id: category})
    if (!sideCategory) return res.status(500).json({message: 'Категорія не знайдена',success: false})

    await SidesCategory.findByIdAndUpdate(sideCategory._id,{products: [...sideCategory.products,newProduct._id]})

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
    
    if (sort === '1') {
      const products = await Sides.find({}).sort([['defaultPrice',-1]])

      if (products.length > 0) return res.status(200).json({
        message: 'Усі сайди отримані!',
        success: true,
        products
      })
    } else if (sort === '2') {
        const products = await Sides.find({}).sort([['defaultPrice',1]])
  
        if (products.length > 0) return res.status(200).json({
          message: 'Усі сайди отримані!',
          success: true,
          products
        })
    } else {
      const products = await Sides.find({})

      if (products.length > 0) return res.status(200).json({
        message: 'Усі сайди отримані!',
        success: true,
        products
      })
    }

  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

export default router