export interface Attachment {
    id: string;
    name: string;
    size: number;
    url: string;
}

export interface TimelineEntry {
    stageId: string;
    stageName: string;
    actor: string;
    note?: string;
    timestamp: string;
}

export interface Complaint {
    id: string;
    studentId: string;
    relatedPaymentId?: string;
    title: string;
    description: string;
    confidential: boolean;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
    currentStage: string;
    timeline: TimelineEntry[];
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export const COMPLAINT_STAGES = [
    { id: 'submitted', name: 'Submitted' },
    { id: 'c3', name: 'C3 Section' },
    { id: 'ha', name: 'HA' },
    { id: 'principal', name: 'Principal' },
    { id: 'dte_head', name: 'DTE Head Officer' },
    { id: 'resolved', name: 'Resolved' }
];
