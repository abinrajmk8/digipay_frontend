import { Transaction } from '@/types/transaction';

const generateTransactions = (count: number): Transaction[] => {
    const transactions: Transaction[] = [];
    const types: any[] = ["EXAM_FEE", "SEM_FEE", "OTHER"];
    const methods: any[] = ["CARD", "UPI", "NETBANK", "WALLET", "CHALLAN"];
    const statuses: any[] = ["SUCCESS", "PENDING", "FAILED"];
    const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5"];

    for (let i = 0; i < count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();

        transactions.push({
            id: `TXN-2025-${(i + 1).toString().padStart(4, '0')}`,
            date,
            amount: Math.floor(Math.random() * 10000) + 500,
            currency: "INR",
            type: types[Math.floor(Math.random() * types.length)],
            paymentMethod: methods[Math.floor(Math.random() * methods.length)],
            semester: semesters[Math.floor(Math.random() * semesters.length)],
            payer: {
                name: "John Doe",
                regNo: "DTE2023001",
                studentId: "STU-1001"
            },
            status,
            receiptId: status === "SUCCESS" ? `REC-${Date.now()}-${i}` : undefined,
            gatewayResponse: {
                transactionId: `GW-${Math.random().toString(36).substring(7)}`,
                responseCode: status === "SUCCESS" ? "00" : "99",
                message: status === "SUCCESS" ? "Approved" : "Failed"
            },
            timeline: [
                { event: "Initiated", timestamp: date, actor: "User" },
                { event: "Processing", timestamp: new Date(new Date(date).getTime() + 1000).toISOString(), actor: "System" },
                { event: status === "SUCCESS" ? "Completed" : "Failed", timestamp: new Date(new Date(date).getTime() + 2000).toISOString(), actor: "Gateway" }
            ]
        });
    }
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const demoTransactions = generateTransactions(25);
