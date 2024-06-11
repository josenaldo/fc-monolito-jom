import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import {
  GenerateInvoiceUsecaseInputDto,
  GenerateInvoiceUsecaseOutputDto,
} from '@/modules/invoice/usecase/generate-invoice/generate-invoice.dto'

export class GenerateInvoiceUsecase implements UsecaseInterface {
  private _repository: InvoiceGateway

  constructor(repository: InvoiceGateway) {
    this._repository = repository
  }

  async execute(
    input: GenerateInvoiceUsecaseInputDto
  ): Promise<GenerateInvoiceUsecaseOutputDto> {
    const id: Id = new Id(input.id)

    const address: Address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    })

    const items: InvoiceItem[] = input.items.map((item) => {
      return new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })
    })

    const invoice = new Invoice({
      id: id,
      name: input.name,
      document: input.document,
      address: address,
      items: items,
    })

    await this._repository.save(invoice)

    return {
      id: invoice.id.value,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
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
