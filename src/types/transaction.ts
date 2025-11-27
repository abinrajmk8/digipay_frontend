export type TransactionType = "EXAM_FEE" | "SEM_FEE" | "OTHER";
export type PaymentMethod = "CARD" | "UPI" | "NETBANK" | "WALLET" | "CHALLAN";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface TransactionTimelineEntry {
    event: string;
    actor?: string;
    timestamp: string;
    note?: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    currency: "INR";
    type: TransactionType;
    paymentMethod: PaymentMethod;
    semester?: string;
    payer: {
        name: string;
        regNo: string;
        studentId: string;
    };
    status: TransactionStatus;
    receiptId?: string;
    gatewayResponse?: object;
    notes?: string;
    timeline?: TransactionTimelineEntry[];
}

export interface TransactionFilters {
    from?: string;
    to?: string;
    type?: TransactionType | "";
    status?: TransactionStatus | "";
    semester?: string;
    q?: string;
    sortBy?: "date" | "amount" | "status";
    sortDir?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface TransactionsResponse {
    total: number;
    page: number;
    limit: number;
    transactions: Transaction[];
}
