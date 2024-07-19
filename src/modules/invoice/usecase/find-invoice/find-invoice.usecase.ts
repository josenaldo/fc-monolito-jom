import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import {
  FindInvoiceUsecaseInputDto,
  FindInvoiceUsecaseOutputDto,
} from '@/modules/invoice/usecase/find-invoice/find-invoice.dto'

export class FindInvoiceUsecase implements UsecaseInterface {
  private _repository: InvoiceGateway

  constructor(repository: InvoiceGateway) {
    this._repository = repository
  }

  async execute(
    input: FindInvoiceUsecaseInputDto
  ): Promise<FindInvoiceUsecaseOutputDto> {
    const invoice: Invoice = await this._repository.find(input.id)

    if (!invoice) throw new Error('Invoice not found')

    return {
      id: invoice.id.value,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipcode: invoice.address.zipcode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
      total: invoice.total,
    }
  }
}
