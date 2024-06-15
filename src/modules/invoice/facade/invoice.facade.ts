import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from '@/modules/invoice/facade/invoice.facade.interface'
import { FindInvoiceUsecaseOutputDto } from '@/modules/invoice/usecase/find-invoice/find-invoice.dto'

export interface InvoiceFacadeProps {
  generateInvoiceUsecase: UsecaseInterface
  findInvoiceUsecase: UsecaseInterface
}

export class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUsecase: UsecaseInterface
  private _findInvoiceUsecase: UsecaseInterface

  constructor(usecaseProps: InvoiceFacadeProps) {
    this._generateInvoiceUsecase = usecaseProps.generateInvoiceUsecase
    this._findInvoiceUsecase = usecaseProps.findInvoiceUsecase
  }

  async create(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateInvoiceUsecase.execute(input)
  }

  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    const output: FindInvoiceUsecaseOutputDto =
      await this._findInvoiceUsecase.execute(input)

    return {
      id: output.id,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      name: output.name,
      document: output.document,
      address: {
        street: output.address.street,
        number: output.address.number,
        complement: output.address.complement,
        city: output.address.city,
        state: output.address.state,
        zipCode: output.address.zipCode,
      },
      items: output.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
      total: output.total,
    }
  }
}
