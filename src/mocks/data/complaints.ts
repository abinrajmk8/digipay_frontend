import { Complaint } from '@/types/complaint';

export const demoComplaints: Complaint[] = [
    {
        id: "CMP-2025-0001",
        studentId: "STU-1001",
        title: "Fee receipt not reflected",
        description: "I paid tuition for Sem 5 but status still shows unpaid.",
        confidential: false,
        attachments: [
            { id: "att-1", name: "payment_screenshot.jpg", size: 1024 * 500, url: "#" }
        ],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        currentStage: "ha",
        status: 'IN_PROGRESS',
        timeline: [
            {
                stageId: 'submitted',
                stageName: 'Submitted',
                actor: 'Student',
                timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                stageId: 'c3',
                stageName: 'C3 Section',
                actor: 'C3 Section Officer',
                note: 'Assigned to HA for verification',
                timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
            },
            {
                stageId: 'ha',
                stageName: 'HA',
                actor: 'Head Assistant',
                note: 'Under review. Checking bank statement.',
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
            }
        ]
    }
];
