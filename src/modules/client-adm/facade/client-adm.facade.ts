import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  ClientAdmFacadeInterface,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import { FindClientUsecaseOutputDto } from '@/modules/client-adm/usecase/find-client/find-client.usecase.dto'

export type ClientAdmFacadeProps = {
  addClientUseCase: UsecaseInterface
  findClientUseCase: UsecaseInterface
}

export class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addClientUseCase: UsecaseInterface
  private _findClientUseCase: UsecaseInterface

  constructor(useCaseProps: ClientAdmFacadeProps) {
    this._addClientUseCase = useCaseProps.addClientUseCase
    this._findClientUseCase = useCaseProps.findClientUseCase
  }

  async addClient(
    input: AddClientFacadeInputDto
  ): Promise<AddClientFacadeOutputDto> {
    const client = await this._addClientUseCase.execute(input)

    return {
      id: client.id,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      document: client.document,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipcode: client.address.zipcode,
      },
    }
  }

  async findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    const client: FindClientUsecaseOutputDto =
      await this._findClientUseCase.execute(input)

    return {
      id: client.id,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      document: client.document,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipcode: client.address.zipcode,
      },
    }
  }
}
