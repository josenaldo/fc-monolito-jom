import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'

export class InvoiceModelToInvoiceMapper
  implements DomainToModelMapperInterface<Invoice, InvoiceModel>
{
  toDomain(invoice: InvoiceModel): Invoice {
    const address = new Address({
      street: invoice.street,
      number: invoice.number,
      complement: invoice.complement,
      city: invoice.city,
      state: invoice.state,
      zipCode: invoice.zipCode,
    })

    const items = invoice.items.map((item) => {
      return new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })
    })

    return new Invoice({
      id: new Id(invoice.id),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      name: invoice.name,
      document: invoice.document,
      address: address,
      items: items,
    })
  }

  toModel(invoice: Invoice): InvoiceModel {
    return new InvoiceModel(
      {
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
        items: invoice.items.map((item) => {
          return {
            id: item.id.value,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          }
        }),
        total: invoice.total,
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    )
  }
}
