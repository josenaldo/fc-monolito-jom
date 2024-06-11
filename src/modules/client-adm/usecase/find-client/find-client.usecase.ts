import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import {
  FindClientUsecaseInputDto,
  FindClientUsecaseOutputDto,
} from '@/modules/client-adm/usecase/find-client/find-client.usecase.dto'

export class FindClientUsecase {
  private _repository: ClientGateway

  constructor(repository: ClientGateway) {
    this._repository = repository
  }

  async execute(
    input: FindClientUsecaseInputDto
  ): Promise<FindClientUsecaseOutputDto> {
    const client = await this._repository.find(input.id)

    if (!client) {
      throw new Error('Client not found')
    }

    return {
      id: client.id.value,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      document: client.document,
      email: client.email,
      address: client.address,
    }
  }
}
