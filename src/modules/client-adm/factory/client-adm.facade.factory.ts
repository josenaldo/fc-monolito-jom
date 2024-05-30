import {
  ClientAdmFacade,
  ClientAdmFacadeProps,
} from '@/modules/client-adm/facade/client-adm.facade'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { AddClientUsecase } from '@/modules/client-adm/usecase/add-client/add-client.usecase'
import { FindClientUsecase } from '@/modules/client-adm/usecase/find-client/find-client.usecase'

export class ClientAdmFacadeFactory {
  static create() {
    const repository = new ClientRepository()

    const usecaseProps: ClientAdmFacadeProps = {
      addClientUseCase: new AddClientUsecase(repository),
      findClientUseCase: new FindClientUsecase(repository),
    }

    return new ClientAdmFacade(usecaseProps)
  }
}
