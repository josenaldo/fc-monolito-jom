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
      if (error.message === 'Client not found') {
        return res.status(404).send({ error: error.message })
      }

      if (error.message === 'Product not found') {
        return res.status(404).send({ error: error.message })
      }

      if (error.message.startsWith('place-order: ')) {
        return res.status(400).send({ error: error.message })
      }

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
      if (error.message === 'Order not found') {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
