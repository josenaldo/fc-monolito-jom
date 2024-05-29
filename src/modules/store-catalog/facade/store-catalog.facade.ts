import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from '@/modules/store-catalog/facade/store-catalog.facade.interface'

export interface StoreCatalogFacadeProps {
  findUsecase: UsecaseInterface
  findAllUsecase: UsecaseInterface
}

export class StoreCatalogFacade {
  private _findUsecase: UsecaseInterface
  private _findAllUsecase: UsecaseInterface

  constructor(props: StoreCatalogFacadeProps) {
    this._findUsecase = props.findUsecase
    this._findAllUsecase = props.findAllUsecase
  }

  async find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUsecase.execute(input)
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUsecase.execute({})
  }
}
