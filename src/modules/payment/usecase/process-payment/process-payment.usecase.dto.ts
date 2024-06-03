export interface ProcessPaymentUsecaseInputDto {
  amount: number
  orderId: string
}

export interface ProcessPaymentUsecaseOutputDto {
  transactionId: string
  createdAt: Date
  updatedAt: Date
  orderId: string
  amount: number
  status: string
}
