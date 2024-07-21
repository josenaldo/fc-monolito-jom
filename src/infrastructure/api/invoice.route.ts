import { InvoiceFacadeFactory } from '@/modules/invoice/factory/invoice.facade.factory'
import express from 'express'

export const invoiceRoute = express.Router()

invoiceRoute.get('/:id', async (req, res) => {
  try {
    const invoicefacade = InvoiceFacadeFactory.create()

    const result = await invoicefacade.find({ id: req.params.id })

    return res.status(200).send(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invoice not found') {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
