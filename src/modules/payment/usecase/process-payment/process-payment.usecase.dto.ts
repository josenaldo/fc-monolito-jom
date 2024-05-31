export interface ProcessPaymentInputDto {
  amount: number
  orderId: string
}

export interface ProcessPaymentOutputDto {
  transactionId: string
  createdAt: Date
  updatedAt: Date
  orderId: string
  amount: number
  status: string
}
