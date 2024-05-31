import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { ClientModelToClientMapper } from '@/modules/client-adm/repository/client-model-to-client.mapper'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { UniqueConstraintError } from 'sequelize'

export class ClientRepository implements ClientGateway {
  private _mapper: DomainToModelMapperInterface<Client, ClientModel>

  constructor() {
    this._mapper = new ClientModelToClientMapper()
  }

  async add(client: Client): Promise<void> {
    try {
      const model = this._mapper.toModel(client)
      await model.save()
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const hasId = Object.entries(error.fields).some(
          ([key, value]) => value === 'id'
        )

        if (hasId) {
          throw new Error('Client already exists')
        }

        throw new Error('Constraint error occurred: ' + error.message)
      }

      throw error
    }
  }

  async find(id: string): Promise<Client> {
    const model = await ClientModel.findByPk(id)

    if (!model) {
      throw new Error('Client not found')
    }

    return this._mapper.toDomain(model)
  }
}
