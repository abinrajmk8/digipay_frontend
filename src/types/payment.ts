export interface Semester {
    id: string;
    title: string;
}

export type FeeStatus = 'PAID' | 'UNPAID' | 'PARTIAL';
export type FeeType = 'TUITION' | 'EXAM' | 'BUS' | 'SURAKSHA' | 'OTHER';

export interface FeeRecord {
    id: string;
    semesterId: string;
    code: string;
    description: string;
    type: FeeType;
    dueDate: string;
    amount: number;
    currency: string;
    status: FeeStatus;
    paidAt?: string;
    receiptId?: string;
}

export interface SemesterSummary {
    id: string;
    title: string;
    semesterNumber: number;
    totalAmount: number;
    totalPaidAmount: number;
    status: FeeStatus;
}

export interface PaymentResponse {
    paymentId: string;
    feeIdsUpdated: string[];
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    receiptIds?: Record<string, string>;
}
