import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import {
  AddClientInputDto,
  AddClientOutputDto,
} from '@/modules/client-adm/usecase/add-client/add-client.usecase.dto'

export class AddClientUsecase implements UsecaseInterface {
  private _repository: ClientGateway

  constructor(repository: ClientGateway) {
    this._repository = repository
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const id: Id = new Id(input.id)

    const cliente = new Client({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: input.name,
      email: input.email,
      address: input.address,
    })

    await this._repository.add(cliente)

    return {
      id: cliente.id.value,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
      name: cliente.name,
      email: cliente.email,
      address: cliente.address,
    }
  }
}
