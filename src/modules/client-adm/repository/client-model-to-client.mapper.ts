import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModel } from '@/modules/client-adm/repository/client.model'

export class ClientModelToClientMapper
  implements DomainToModelMapperInterface<Client, ClientModel>
{
  toDomain(model: ClientModel): Client {
    return new Client({
      id: new Id(model.id),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      name: model.name,
      email: model.email,
      document: model.document,
      address: new Address({
        street: model.street,
        number: model.number,
        complement: model.complement,
        city: model.city,
        state: model.state,
        zipCode: model.zipCode,
      }),
    })
  }

  toModel(domain: Client): ClientModel {
    return new ClientModel({
      id: domain.id.value,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      name: domain.name,
      email: domain.email,
      document: domain.document,
      street: domain.address.street,
      number: domain.address.number,
      complement: domain.address.complement,
      city: domain.address.city,
      state: domain.address.state,
      zipCode: domain.address.zipCode,
    })
  }
}
