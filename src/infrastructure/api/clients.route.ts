import { ClientAdmFacadeFactory } from '@/modules/client-adm/factory/client-adm.facade.factory'
import express from 'express'

export const clientsRoute = express.Router()

clientsRoute.get('/:id', async (req, res) => {
  try {
    const clientsFacade = ClientAdmFacadeFactory.create()

    const result = await clientsFacade.findClient({ id: req.params.id })

    return res.status(200).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})

clientsRoute.post('/', async (req, res) => {
  try {
    const clientsFacade = ClientAdmFacadeFactory.create()

    const result = await clientsFacade.addClient(req.body)

    return res.status(201).send(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
