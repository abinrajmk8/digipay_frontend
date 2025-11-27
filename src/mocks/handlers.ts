import { http, HttpResponse, delay } from 'msw'
import { demoComplaints } from './data/complaints'
import { Complaint, COMPLAINT_STAGES } from '@/types/complaint'
import { demoProfile, verificationRequests } from './data/profile'
import { Profile } from '@/types/profile'
import { demoTransactions } from './data/transactions'
import { Transaction } from '@/types/transaction'
import { demoFees, demoSemesters } from './data/fees'



export const handlers = [


    http.post('/api/auth/login', async ({ request }) => {
        const info = await request.json() as any;
        if (info.username === 'fail') {
            return new HttpResponse(null, { status: 401 })
        }
        return HttpResponse.json({
            token: 'mock-jwt-token',
            user: {
                id: '123',
                name: 'John Doe'
            }
        })
    }),

    // Fee Endpoints
    http.get('/api/user/fees', async () => {
        await delay(500); // Simulate network latency

        // Recompute semester summaries based on current fee statuses
        const currentSemesters = demoSemesters.map(sem => {
            const semFees = demoFees.filter(f => f.semesterId === sem.id);
            const totalAmount = semFees.reduce((sum, f) => sum + f.amount, 0);
            const totalPaidAmount = semFees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);

            let status: 'PAID' | 'PARTIAL' | 'UNPAID' = 'UNPAID';
            if (totalPaidAmount === totalAmount) status = 'PAID';
            else if (totalPaidAmount > 0) status = 'PARTIAL';

            return { ...sem, totalAmount, totalPaidAmount, status };
        });

        return HttpResponse.json({
            studentId: 'STU-1001',
            currentSemester: 5,
            semesters: currentSemesters,
            fees: demoFees
        });
    }),

    http.post('/api/payments/pay', async ({ request }) => {
        await delay(1500); // Simulate processing time
        const body = await request.json() as any;

        // Simulate random failure (10%)
        if (Math.random() < 0.1) {
            return new HttpResponse(null, { status: 500, statusText: 'Payment Gateway Error' });
        }

        let feeIdsToUpdate: string[] = [];

        if (body.semesterId) {
            feeIdsToUpdate = demoFees
                .filter(f => f.semesterId === body.semesterId && f.status !== 'PAID')
                .map(f => f.id);
        } else if (body.feeIds) {
            feeIdsToUpdate = body.feeIds;
        } else if (body.feeId) {
            feeIdsToUpdate = [body.feeId];
        }

        const receiptIds: Record<string, string> = {};

        feeIdsToUpdate.forEach(id => {
            const fee = demoFees.find(f => f.id === id);
            if (fee) {
                fee.status = 'PAID';
                fee.paidAt = new Date().toISOString();
                fee.receiptId = `REC_${Date.now()}_${id}`;
                receiptIds[id] = fee.receiptId;
            }
        });

        return HttpResponse.json({
            paymentId: `PAY_${Date.now()}`,
            feeIdsUpdated: feeIdsToUpdate,
            status: 'SUCCESS',
            receiptIds
        });
    }),

    http.get('/api/payments/:feeId/receipt', async () => {
        await delay(500);
        const pdfContent = '%PDF-1.4\n...Mock Receipt...';
        return new HttpResponse(pdfContent, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="receipt.pdf"'
            }
        });
    }),

    // Complaint Endpoints
    http.get('/api/complaints', async () => {
        await delay(400);
        return HttpResponse.json(demoComplaints);
    }),

    http.get('/api/complaints/:id', async ({ params }) => {
        await delay(300);
        const complaint = demoComplaints.find(c => c.id === params.id);
        if (!complaint) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(complaint);
    }),

    http.post('/api/complaints', async ({ request }) => {
        await delay(600);
        const data = await request.json() as any;

        const newComplaint: Complaint = {
            id: `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            studentId: data.studentId || 'STU-1001',
            title: data.title,
            description: data.description,
            confidential: data.confidential || false,
            relatedPaymentId: data.relatedPaymentId,
            attachments: data.attachments || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentStage: 'submitted',
            status: 'OPEN',
            timeline: [
                {
                    stageId: 'submitted',
                    stageName: 'Submitted',
                    actor: 'Student',
                    timestamp: new Date().toISOString()
                }
            ]
        };

        demoComplaints.unshift(newComplaint);
        return HttpResponse.json(newComplaint);
    }),

    http.post('/api/complaints/:id/comment', async ({ params, request }) => {
        await delay(400);
        const { actor, note } = await request.json() as any;
        const complaint = demoComplaints.find(c => c.id === params.id);

        if (!complaint) {
            return new HttpResponse(null, { status: 404 });
        }

        complaint.timeline.push({
            stageId: complaint.currentStage,
            stageName: COMPLAINT_STAGES.find(s => s.id === complaint.currentStage)?.name || complaint.currentStage,
            actor: actor || 'User',
            note,
            timestamp: new Date().toISOString()
        });
        complaint.updatedAt = new Date().toISOString();

        return HttpResponse.json(complaint);
    }),

    http.post('/api/complaints/:id/escalate', async ({ params }) => {
        await delay(500);
        const complaint = demoComplaints.find(c => c.id === params.id);

        if (!complaint) {
            return new HttpResponse(null, { status: 404 });
        }

        const currentStageIndex = COMPLAINT_STAGES.findIndex(s => s.id === complaint.currentStage);
        if (currentStageIndex === -1 || currentStageIndex === COMPLAINT_STAGES.length - 1) {
            return new HttpResponse(null, { status: 400, statusText: 'Cannot escalate' });
        }

        const nextStage = COMPLAINT_STAGES[currentStageIndex + 1];
        complaint.currentStage = nextStage.id;
        complaint.status = nextStage.id === 'resolved' ? 'RESOLVED' : 'IN_PROGRESS';

        complaint.timeline.push({
            stageId: nextStage.id,
            stageName: nextStage.name,
            actor: 'System',
            note: `Escalated to ${nextStage.name}`,
            timestamp: new Date().toISOString()
        });
        complaint.updatedAt = new Date().toISOString();

        return HttpResponse.json(complaint);
    }),

    // Profile Endpoints
    http.get('/api/user/me', async () => {
        await delay(300);
        return HttpResponse.json(demoProfile);
    }),

    http.put('/api/user/me', async ({ request }) => {
        await delay(500);
        const updates = await request.json() as Partial<Profile>;

        // In a real app, verify sensitive fields here if needed
        Object.assign(demoProfile, updates);
        demoProfile.updatedAt = new Date().toISOString();

        return HttpResponse.json(demoProfile);
    }),

    http.post('/api/verify/send', async ({ request }) => {
        await delay(400);
        const { field, newValue } = await request.json() as any;
        const verificationId = `VER-${Date.now()}`;
        const otp = '123456'; // Mock OTP

        verificationRequests.set(verificationId, {
            verificationId,
            field,
            newValue,
            otp,
            expiresAt: Date.now() + 300000 // 5 mins
        });

        return HttpResponse.json({
            success: true,
            otpSent: true,
            verificationId,
            mockOtp: otp // Exposed for demo
        });
    }),

    http.post('/api/verify/confirm', async ({ request }) => {
        await delay(600);
        const { verificationId, otp } = await request.json() as any;
        const requestData = verificationRequests.get(verificationId);

        if (!requestData) {
            return new HttpResponse(null, { status: 404, statusText: 'Invalid verification ID' });
        }

        if (requestData.otp !== otp) {
            return new HttpResponse(null, { status: 400, statusText: 'Invalid OTP' });
        }

        if (Date.now() > requestData.expiresAt) {
            return new HttpResponse(null, { status: 400, statusText: 'OTP Expired' });
        }

        // Apply the change
        if (requestData.field === 'bank.linkedPhone') {
            if (demoProfile.bank) {
                demoProfile.bank.linkedPhone = requestData.newValue;
                demoProfile.bank.phoneVerified = true;
            }
        } else if (requestData.field.includes('.')) {
            const [parent, child] = requestData.field.split('.');
            if (parent === 'address' && demoProfile.address) {
                (demoProfile.address as any)[child] = requestData.newValue;
            } else if (parent === 'emergencyContact' && demoProfile.emergencyContact) {
                (demoProfile.emergencyContact as any)[child] = requestData.newValue;
            }
        } else {
            (demoProfile as any)[requestData.field] = requestData.newValue;
        }

        verificationRequests.delete(verificationId);

        return HttpResponse.json({
            success: true,
            verified: true,
            updatedProfile: demoProfile
        });
    }),

    http.post('/api/user/bank/verify-phone', async () => {
        await delay(500);
        const verificationId = `VER-BANK-${Date.now()}`;
        const otp = '123456';

        verificationRequests.set(verificationId, {
            verificationId,
            field: 'bank.phoneVerified', // Special field to just mark verified
            newValue: true,
            otp,
            expiresAt: Date.now() + 300000
        });

        return HttpResponse.json({
            success: true,
            otpSent: true,
            verificationId,
            mockOtp: otp
        });
    }),

    http.post('/api/user/change-password', async () => {
        await delay(800);
        // In a real app, we'd verify old password.
        return HttpResponse.json({ success: true });
    }),

    // Transaction Endpoints
    http.get('/api/transactions', async ({ request }) => {
        await delay(400);
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const limit = Number(url.searchParams.get('limit')) || 10;
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');
        const q = url.searchParams.get('q')?.toLowerCase();
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        const sortBy = url.searchParams.get('sortBy') || 'date';
        const sortDir = url.searchParams.get('sortDir') || 'desc';

        let filtered = [...demoTransactions];

        if (status) filtered = filtered.filter(t => t.status === status);
        if (type) filtered = filtered.filter(t => t.type === type);
        if (q) filtered = filtered.filter(t =>
            t.id.toLowerCase().includes(q) ||
            t.payer.name.toLowerCase().includes(q) ||
            t.payer.regNo.toLowerCase().includes(q)
        );
        if (from) filtered = filtered.filter(t => new Date(t.date) >= new Date(from));
        if (to) filtered = filtered.filter(t => new Date(t.date) <= new Date(to));

        // Sorting
        filtered.sort((a, b) => {
            let valA: any = a[sortBy as keyof Transaction];
            let valB: any = b[sortBy as keyof Transaction];

            if (sortBy === 'date') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        const total = filtered.length;
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return HttpResponse.json({
            total,
            page,
            limit,
            transactions: paginated
        });
    }),

    http.get('/api/transactions/:id', async ({ params }) => {
        await delay(300);
        const transaction = demoTransactions.find(t => t.id === params.id);
        if (!transaction) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(transaction);
    }),

    http.get('/api/transactions/:id/receipt', async () => {
        await delay(500);
        const pdfContent = '%PDF-1.4\n...Mock Receipt...';
        return new HttpResponse(pdfContent, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="receipt.pdf"'
            }
        });
    }),

    http.post('/api/transactions/export', async () => {
        // In a real app, we'd apply filters from body/query to generate CSV
        // For demo, just return a dummy CSV
        const csvContent = "ID,Date,Amount,Status\nTXN-001,2025-01-01,1000,SUCCESS\nTXN-002,2025-01-02,500,PENDING";

        return new HttpResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="transactions.csv"'
            }
        });
    })
];
