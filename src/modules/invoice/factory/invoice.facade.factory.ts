import {
  InvoiceFacade,
  InvoiceFacadeProps,
} from '@/modules/invoice/facade/invoice.facade'
import { InvoiceRepository } from '@/modules/invoice/repository/invoice.repository'

import { FindInvoiceUsecase } from '@/modules/invoice/usecase/find-invoice/find-invoice.usecase'
import { GenerateInvoiceUsecase } from '@/modules/invoice/usecase/generate-invoice/generate-invoice.usecase'

export class InvoiceFacadeFactory {
  static create() {
    const repository = new InvoiceRepository()

    const usecaseProps: InvoiceFacadeProps = {
      generateInvoiceUsecase: new GenerateInvoiceUsecase(repository),
      findInvoiceUsecase: new FindInvoiceUsecase(repository),
    }

    return new InvoiceFacade(usecaseProps)
  }
}
