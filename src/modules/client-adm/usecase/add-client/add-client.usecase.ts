import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import {
  AddClientUsecaseInputDto,
  AddClientUsecaseOutputDto,
} from '@/modules/client-adm/usecase/add-client/add-client.usecase.dto'

export class AddClientUsecase implements UsecaseInterface {
  private _repository: ClientGateway

  constructor(repository: ClientGateway) {
    this._repository = repository
  }

  async execute(
    input: AddClientUsecaseInputDto
  ): Promise<AddClientUsecaseOutputDto> {
    const id: Id = new Id(input.id)
    let address: Address

    if (input.address) {
      address = new Address({
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        parentContext: 'client-adm/client',
      })
    }

    const cliente = new Client({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: input.name,
      email: input.email,
      document: input.document,
      address: address,
    })

    await this._repository.add(cliente)

    return {
      id: cliente.id.value,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
      name: cliente.name,
      email: cliente.email,
      document: cliente.document,
      address: {
        street: cliente.address.street,
        number: cliente.address.number,
        complement: cliente.address.complement,
        city: cliente.address.city,
        state: cliente.address.state,
        zipCode: cliente.address.zipCode,
      },
    }
  }
}
