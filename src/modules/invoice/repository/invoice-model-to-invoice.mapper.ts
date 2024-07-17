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
  toDomain(model: InvoiceModel): Invoice {
    const address = new Address({
      street: model.street,
      number: model.number,
      complement: model.complement,
      city: model.city,
      state: model.state,
      zipcode: model.zipcode,
    })

    const items = model.items.map((item) => {
      return new InvoiceItem({
        id: new Id(item.id),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })
    })

    return new Invoice({
      id: new Id(model.id),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      name: model.name,
      document: model.document,
      address: address,
      items: items,
    })
  }

  toModel(domain: Invoice): InvoiceModel {
    return new InvoiceModel(
      {
        id: domain.id.value,
        createdAt: domain.createdAt,
        updatedAt: domain.updatedAt,
        name: domain.name,
        document: domain.document,
        street: domain.address.street,
        number: domain.address.number,
        complement: domain.address.complement,
        city: domain.address.city,
        state: domain.address.state,
        zipcode: domain.address.zipcode,
        items: domain.items.map((item) => {
          return {
            id: item.id.value,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          }
        }),
        total: domain.total,
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    )
  }
}
