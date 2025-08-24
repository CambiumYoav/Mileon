export class Payment {
    paymentOptionId!: number;
    creditCardTransactionId?: string;
    amount?: number;
}

export class TicketPaymentBalance {
    sumPaymentBalance!: number;
    numOfItems!: number;
}

