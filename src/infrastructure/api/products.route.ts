import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductAdmFacadeFactory } from '@/modules/product-adm/factory/product-adm.facade.factory'
import express, { Request, Response } from 'express'

export const productsRoute = express.Router()

productsRoute.get('/:id', async (req: Request, res: Response) => {
  try {
    const productsFacade: ProductAdmFacadeInterface =
      ProductAdmFacadeFactory.create()
    const id = req.params.id
    const result = await productsFacade.findProduct({ id: id })

    return res.status(200).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})

productsRoute.post('/', async (req: Request, res: Response) => {
  try {
    const productsFacade: ProductAdmFacadeInterface =
      ProductAdmFacadeFactory.create()
    const result = await productsFacade.addProduct(req.body)

    return res.status(201).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})

productsRoute.get('/:id/stock', async (req: Request, res: Response) => {
  try {
    const productsFacade: ProductAdmFacadeInterface =
      ProductAdmFacadeFactory.create()
    const id = req.params.id
    const result = await productsFacade.checkStock({ productId: id })

    return res.status(200).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
