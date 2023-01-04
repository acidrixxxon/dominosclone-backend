import express from 'express'
import PizzaController from '../Controllers/PizzaController.js'
import PizzaCategory from '../Models/Pizza/PizzaCategoryModel.js'
import PizzaIngridientCategory from '../Models/Pizza/PizzaIngridientCategory.js'
import PizzaIngridient from '../Models/Pizza/PizzaIngridientModel.js'
import Pizza from '../Models/Pizza/PizzaModel.js'

const router = express.Router()


router.post('/add_category',async (req,res) => {
  try {
    const { title } = req.body

    const newCategory = await PizzaCategory.create({title})
  
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
    const data = await PizzaCategory.find({}).populate({path: 'products',populate: {path: 'ingridients',select: '-_id',populate: {path: 'ingridientId'}}})


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

    const result = await PizzaCategory.findByIdAndRemove(categoryId)

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
    const { title,imageUrl,category,variants,defaultPrice,fullimageUrl,aNewOne,ingridients } = req.body
    
    const newProduct = await Pizza.create({
      title,imageUrl,defaultPrice,class: req.body.class,variants,category,fullimageUrl,aNewOne,ingridients
    })

    const pizzaCategory = await PizzaCategory.findById({_id: category})
    if (!pizzaCategory) return res.status(500).json({message: 'Категорія не знайдена',success: false})

    await PizzaCategory.findByIdAndUpdate(pizzaCategory._id,{products: [...pizzaCategory.products,newProduct._id]})

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
      const products = await Pizza.find({}).populate({path: 'ingridients',populate: {path: 'ingridientId'}}).sort([['defaultPrice',-1]])

      if (products.length > 0) return res.status(200).json({
        message: 'Усі піцци отримані!',
        success: true,
        products
      })
    } else if (sort === '2') {
      const products = await Pizza.find({}).populate({path: 'ingridients',populate: {path: 'ingridientId'}}).sort([['defaultPrice',1]])

      if (products.length > 0) return res.status(200).json({
        message: 'Усі піцци отримані!',
        success: true,
        products
      })
    } else {
      const products = await Pizza.find({}).populate({path: 'ingridients',populate: {path: 'ingridientId'}}).sort([['rating',-1]])

      if (products.length > 0) return res.status(200).json({
        message: 'Усі піцци отримані!',
        success: true,
        products
      })
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.post('/ingridient/add_category',async (req,res) => {
  try {
    const { title } = req.body

    if(!title) return res.status(500).json({success: false,message: 'Вкажіть назву категорії!'})

    const newIngridientCategory = await PizzaIngridientCategory.create({title})
    if (newIngridientCategory) return res.status(200).json({
      message: 'Категорія інгрідіенту створена!',
      success: true,
      category: newIngridientCategory
    })


  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.post('/ingridient/add_ingridient',async (req,res) => {
  try {
    const { title,imageUrl,addPrice,category } = req.body

    if(!title) return res.status(500).json({success: false,message: 'Вкажіть назву категорії!'})
    if(!imageUrl) return res.status(500).json({success: false,message: 'Вкажіть зображення категорії!'})
    if(!addPrice) return res.status(500).json({success: false,message: 'Вкажіть ціну категорії!'})
    if(!category) return res.status(500).json({success: false,message: 'Вкажіть категорію інгрідієнту!'})

    const newIngridient = await PizzaIngridient.create({ title,imageUrl,addPrice,category })

    const ingridientCategory = await PizzaIngridientCategory.findById({_id: category})
    if (!ingridientCategory) return res.status(500).json({success: false,message: 'Категорія не знайдена!'})

    await PizzaIngridientCategory.findByIdAndUpdate({_id: category},{ingridients: [...ingridientCategory.ingridients,newIngridient._id]})

    if (newIngridient) return res.status(200).json({
      message: 'Категорія інгрідіенту створена!',
      success: true,
      ingridient: newIngridient
    })


  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

router.get('/ingridient/get_all',PizzaController.getIngridientsList)

router.get('/product/:id',PizzaController.getPizzaById)




export default router