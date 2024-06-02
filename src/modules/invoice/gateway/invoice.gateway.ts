import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'

export interface InvoiceGateway {
  save(invoice: Invoice): Promise<void>
  find(id: string): Promise<Invoice>
}
