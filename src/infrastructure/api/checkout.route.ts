import { CheckoutFacadeFactory } from '@/modules/checkout/factory/checkout.facade.factory'
import express from 'express'

export const checkoutRoute = express.Router()

checkoutRoute.post('/', async (req, res) => {
  try {
    const checkoutFacede = CheckoutFacadeFactory.create()

    const result = await checkoutFacede.placeOrder(req.body)

    return res.status(201).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})

checkoutRoute.get('/:id', async (req, res) => {
  try {
    const checkoutFacede = CheckoutFacadeFactory.create()

    const result = await checkoutFacede.findOrder({ id: req.params.id })

    return res.status(200).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
