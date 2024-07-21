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
      if (error.message === 'Client not found') {
        return res.status(404).send({ error: error.message })
      }

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
      if (error.message === 'Client already exists') {
        return res.status(409).send({ error: error.message })
      }

      if (error.message.startsWith('client-adm/client:')) {
        return res.status(400).send({ error: error.message })
      }

      return res.status(500).send({ error: error.message })
    }
    return res.status(500).send({ error: error })
  }
})
