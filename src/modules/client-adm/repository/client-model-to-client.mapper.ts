import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModel } from '@/modules/client-adm/repository/client.model'

export class ClientModelToClientMapper {
  static toClient(client: ClientModel) {
    return new Client({
      id: new Id(client.id),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    })
  }

  static toModel(client: Client) {
    return {
      id: client.id.value,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    }
  }
}
