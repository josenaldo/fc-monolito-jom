import { productsRoute } from '@/infrastructure/api/products.route'
import express, { Express } from 'express'

export const app: Express = express()
app.use(express.json())
app.use('/products', productsRoute)
// app.use('/products', productRoute)
