import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModelToInvoiceMapper } from '@/modules/invoice/repository/invoice-model-to-invoice.mapper'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { UniqueConstraintError } from 'sequelize'

export class InvoiceRepository implements InvoiceGateway {
  private _mapper: DomainToModelMapperInterface<Invoice, InvoiceModel>

  constructor() {
    this._mapper = new InvoiceModelToInvoiceMapper()
  }

  async save(invoice: Invoice): Promise<void> {
    try {
      const model: InvoiceModel = this._mapper.toModel(invoice)
      await model.save()
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const hasId = Object.entries(error.fields).some(
          ([key, value]) => value === 'id'
        )

        if (hasId) {
          throw new Error('Invoice already exists')
        }

        throw new Error('Constraint error occurred: ' + error.message)
      }

      throw error
    }
  }

  async find(id: string): Promise<Invoice> {
    const model = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel],
    })

    if (!model) {
      throw new Error('Invoice not found')
    }

    return this._mapper.toDomain(model)
  }
}
