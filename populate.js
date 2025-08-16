require('dotenv').config()

const connectDB = require('./db/connectDB')
const Product = require('./models/Product')

const productsJSON = require('./products.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_DB_URI)
    await Product.deleteMany()
    await Product.create(productsJSON)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
