import { FeeRecord, SemesterSummary } from '@/types/payment';

const generateFees = (): { fees: FeeRecord[], semesters: SemesterSummary[] } => {
    const fees: FeeRecord[] = [];
    const semesters: SemesterSummary[] = [];

    for (let i = 1; i <= 7; i++) {
        const semId = `sem${i}`;
        const isPast = i < 5; // Sem 1-4 are past/paid
        const isCurrent = i === 5; // Sem 5 is current/partial

        const semFees: FeeRecord[] = [
            {
                id: `${semId}_tuition`,
                semesterId: semId,
                code: `${semId.toUpperCase()}_TUITION`,
                description: `Tuition Fee - Semester ${i}`,
                type: 'TUITION',
                dueDate: isPast ? '2023-05-15' : isCurrent ? '2025-11-15' : '2026-05-15',
                amount: 6000,
                currency: 'INR',
                status: isPast ? 'PAID' : isCurrent ? 'PAID' : 'UNPAID',
                paidAt: isPast || isCurrent ? '2023-05-10T10:00:00Z' : undefined,
                receiptId: isPast || isCurrent ? `REC_${semId}_TUITION` : undefined
            },
            {
                id: `${semId}_exam`,
                semesterId: semId,
                code: `${semId.toUpperCase()}_EXAM`,
                description: `Exam Fee - Semester ${i}`,
                type: 'EXAM',
                dueDate: isPast ? '2023-05-20' : isCurrent ? '2025-11-20' : '2026-05-20',
                amount: 2000,
                currency: 'INR',
                status: isPast ? 'PAID' : 'UNPAID',
                paidAt: isPast ? '2023-05-18T10:00:00Z' : undefined,
                receiptId: isPast ? `REC_${semId}_EXAM` : undefined
            },
            {
                id: `${semId}_bus`,
                semesterId: semId,
                code: `${semId.toUpperCase()}_BUS`,
                description: `Bus Fee - Semester ${i}`,
                type: 'BUS',
                dueDate: isPast ? '2023-05-15' : isCurrent ? '2025-11-15' : '2026-05-15',
                amount: 2000,
                currency: 'INR',
                status: isPast ? 'PAID' : 'UNPAID',
                paidAt: isPast ? '2023-05-10T10:00:00Z' : undefined,
                receiptId: isPast ? `REC_${semId}_BUS` : undefined
            }
        ];

        fees.push(...semFees);

        const totalAmount = semFees.reduce((sum, f) => sum + f.amount, 0);
        const totalPaidAmount = semFees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);

        let status: 'PAID' | 'PARTIAL' | 'UNPAID' = 'UNPAID';
        if (totalPaidAmount === totalAmount) status = 'PAID';
        else if (totalPaidAmount > 0) status = 'PARTIAL';

        semesters.push({
            id: semId,
            title: `Semester ${i}`,
            semesterNumber: i,
            totalAmount,
            totalPaidAmount,
            status
        });
    }

    return { fees, semesters };
};

export const { fees: demoFees, semesters: demoSemesters } = generateFees();
