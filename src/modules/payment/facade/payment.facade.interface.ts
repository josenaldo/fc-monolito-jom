export interface PaymentFacadeInputDto {
  amount: number
  orderId: string
}

export interface PaymentFacadeOutputDto {
  transactionId: string
  createdAt: Date
  updatedAt: Date
  orderId: string
  amount: number
  status: string
}

export interface PaymentFacadeInterface {
  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto>
}
