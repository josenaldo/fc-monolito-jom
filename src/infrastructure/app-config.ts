import { checkoutRoute } from '@/infrastructure/api/checkout.route'
import { clientsRoute } from '@/infrastructure/api/clients.route'
import { invoiceRoute } from '@/infrastructure/api/invoice.route'
import { productsRoute } from '@/infrastructure/api/products.route'
import express, { Express } from 'express'

export const app: Express = express()
app.use(express.json())
app.use('/products', productsRoute)
app.use('/clients', clientsRoute)
app.use('/checkout', checkoutRoute)
app.use('/invoices', invoiceRoute)
