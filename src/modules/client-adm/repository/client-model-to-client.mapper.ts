import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModel } from '@/modules/client-adm/repository/client.model'

export class ClientModelToClientMapper
  implements DomainToModelMapperInterface<Client, ClientModel>
{
  toDomain(client: ClientModel): Client {
    return new Client({
      id: new Id(client.id),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    })
  }

  toModel(client: Client): ClientModel {
    return new ClientModel({
      id: client.id.value,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    })
  }
}
