import { ListCountResult } from "./listCountResult"
import { Ticket } from "./ticket"

export interface FinancialTransactionDetails {
    transactionActionId: number
    creationDate?: Date
    details?: string
    debit?: number
    credit?: string
    totalSum?: number
}

export interface FinanacialTransactions4Ticket {
    financialTransactions?: FinancialTransactionDetails[]
    paymentsSummary: PaymentsSummary
}

export interface PaymentsSummary {
    originalSum?: number
    arrearsAdditions?: number
    fees?: number
    sum?: number
    paid?: number
    balance?: number
}


export interface Tickets4FinanacialTransactions {
    tickets: ListCountResult<Ticket>
    balanceSummary: BalanceSummary

}

export interface BalanceSummary {
    balance4Authorities: Balance4Authority[]
    openTickets: number
    sum: number
    paid: number
    balance: number
    arrearsAdditions: number
}

export interface Balance4Authority {
    authorityName: string
    openTickets: number
    sum: number
    paid: number
}
