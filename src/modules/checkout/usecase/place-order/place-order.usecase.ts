import { Notification } from '@/modules/@shared/domain/notification/notification'
import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import {
  Order,
  OrderProps,
  OrderStatus,
} from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import {
  PlaceOrderUsecaseInputDto,
  PlaceOrderUsecaseOutputDto,
} from '@/modules/checkout/usecase/place-order/place-order.dto'
import {
  ClientAdmFacadeInterface,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import {
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from '@/modules/invoice/facade/invoice.facade.interface'
import {
  PaymentFacadeInterface,
  PaymentFacadeOutputDto,
} from '@/modules/payment/facade/payment.facade.interface'
import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import {
  FindStoreCatalogFacadeOutputDto,
  StoreCatalogFacadeInterface,
} from '@/modules/store-catalog/facade/store-catalog.facade.interface'

export type PlaceOrderUsecaseProps = {
  repository: CheckoutGateway
  clientFacade: ClientAdmFacadeInterface
  productFacade: ProductAdmFacadeInterface
  storeCatalogFacade: StoreCatalogFacadeInterface
  paymentFacade: PaymentFacadeInterface
  invoiceFacade: InvoiceFacadeInterface
}

export type FindProductOutput = {
  [key: string]: {
    productId: string
    name: string
    quantity: number
    price: number
  }
}

export class PlaceOrderUsecase implements UsecaseInterface {
  private _repository: CheckoutGateway
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _storeCatalogFacade: StoreCatalogFacadeInterface
  private _paymentFacade: PaymentFacadeInterface
  private _invoiceFacade: InvoiceFacadeInterface

  protected _notification: Notification
  private _CONTEXT_NAME: string = 'place-order'

  constructor(props: PlaceOrderUsecaseProps) {
    this._repository = props.repository
    this._clientFacade = props.clientFacade
    this._productFacade = props.productFacade
    this._storeCatalogFacade = props.storeCatalogFacade
    this._paymentFacade = props.paymentFacade
    this._invoiceFacade = props.invoiceFacade
    this._notification = new Notification()
  }

  async execute(
    input: PlaceOrderUsecaseInputDto
  ): Promise<PlaceOrderUsecaseOutputDto> {
    //buscar cliente. Caso não exista, retornar Client not foun
    const client: Client = await this.findClient(input)

    //validar produtos (verificar stoque, preço, etc)
    await this.validateItems(input)

    const products = await this.findProducts(input)

    // recuperar produtos
    const orderItems: OrderItem[] = this.createOrderItems(input, products)

    //criar Order
    const orderProps: OrderProps = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      items: orderItems,
      status: OrderStatus.PENDING,
    }

    const order: Order = new Order(orderProps)

    // processar pagamento
    const payment: PaymentFacadeOutputDto = await this._paymentFacade.process({
      orderId: order.id.value,
      amount: order.total,
    })

    let invoice: GenerateInvoiceFacadeOutputDto = null
    let invoiceId: string = null

    // caso pagamento aprovado, gerar fatura e aprovar order
    if (payment.status === 'approved') {
      const items = order.items.map((item) => ({
        id: item.productId,
        name: products[item.productId].name,
        quantity: item.quantity,
        price: item.price,
      }))

      const invoiceProps = {
        id: new Id().value,
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: items,
      }
      invoice = await this._invoiceFacade.create(invoiceProps)
      invoiceId = invoice.id
      order.approve()
    } else if (payment.status === 'declined') {
      order.cancel()
    } else {
      //erro no pagamento
      throw new Error('Payment error')
    }

    // salvar pedido
    await this._repository.add(order)

    //retornar dto
    return {
      id: order.id.value,
      invoiceId: invoiceId,
      status: order.status,
      total: order.total,
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    }
  }

  private async findClient(input: PlaceOrderUsecaseInputDto): Promise<Client> {
    const clientAdmOutput: FindClientFacadeOutputDto =
      await this._clientFacade.findClient({ id: input.clientId })

    if (!clientAdmOutput) {
      this.addNotificationError('Client not found')
    }
    this.throwIfHasNotificationErrors()

    //criar  Client
    const clientProps = {
      id: new Id(clientAdmOutput.id),
      name: clientAdmOutput.name,
      email: clientAdmOutput.email,
      document: clientAdmOutput.document,
      address: new Address({
        street: clientAdmOutput.address.street,
        number: clientAdmOutput.address.number,
        complement: clientAdmOutput.address.complement,
        city: clientAdmOutput.address.city,
        state: clientAdmOutput.address.state,
        zipCode: clientAdmOutput.address.zipCode,
      }),
    }
    const client: Client = new Client(clientProps)
    return client
  }

  private async validateItems(input: PlaceOrderUsecaseInputDto): Promise<void> {
    if (input.items.length === 0) {
      this.addNotificationError('No products selected')
    }

    for (const item of input.items) {
      const productStock = await this._productFacade.checkStock({
        productId: item.productId,
      })

      //validar estoque
      if (item.quantity > productStock?.stock) {
        this.addNotificationError(
          `Product ${item.productId} is not available in stock`
        )
      }
    }
    this.throwIfHasNotificationErrors()
  }

  private async findProducts(
    input: PlaceOrderUsecaseInputDto
  ): Promise<FindProductOutput> {
    const products: FindProductOutput = {}

    const findProductOutputPromises = input.items.map(async (item) => {
      const productOutput: FindStoreCatalogFacadeOutputDto =
        await this.findProduct(item.productId)

      return {
        productId: productOutput.id,
        name: productOutput.name,
        quantity: item.quantity,
        price: productOutput.salesPrice,
      }
    })

    const findProductOutputItems = await Promise.all(findProductOutputPromises)

    for (const productOutput of findProductOutputItems) {
      products[productOutput.productId] = productOutput
    }

    return products
  }

  private createOrderItems(
    input: PlaceOrderUsecaseInputDto,
    products: FindProductOutput
  ): OrderItem[] {
    const orderItems = input.items.map((item) => {
      const productOutput = products[item.productId]

      const orderItemProps = {
        id: new Id(),
        name: productOutput.name,
        productId: productOutput.productId,
        quantity: item.quantity,
        price: productOutput.price,
      }

      return new OrderItem(orderItemProps)
    })
    return orderItems
  }

  private async findProduct(
    productId: string
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    const output: FindStoreCatalogFacadeOutputDto =
      await this._storeCatalogFacade.find({ id: productId })

    if (!output) {
      this.addNotificationError(`Product ${productId} not found`)
    }
    this.throwIfHasNotificationErrors()
    return output
  }

  private addNotificationError(message: string): void {
    this._notification.addError({
      message,
      context: this._CONTEXT_NAME,
    })
  }

  private throwIfHasNotificationErrors(): void {
    this._notification.throwIfHasNotificationErrors(this._CONTEXT_NAME)
  }
}
