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
    return await this._addClientUseCase.execute(input)
  }

  async findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    const output: FindClientUsecaseOutputDto =
      await this._findClientUseCase.execute(input)

    return {
      id: output.id,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      name: output.name,
      email: output.email,
      address: output.address,
    }
  }
}
