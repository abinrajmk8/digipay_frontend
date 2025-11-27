import { useState } from 'react';
import { Complaint, COMPLAINT_STAGES } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/complaints/Timeline';
import { NewCommentModal } from '@/components/complaints/NewCommentModal';
import { ArrowUpCircle, MessageSquare, Paperclip, Lock } from 'lucide-react';
import axios from 'axios';

interface ComplaintDetailProps {
    complaint: Complaint;
    onUpdate: (updatedComplaint: Complaint) => void;
}

export function ComplaintDetail({ complaint, onUpdate }: ComplaintDetailProps) {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddComment = async (note: string) => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`/api/complaints/${complaint.id}/comment`, {
                actor: 'Student', // Mock actor
                note
            });
            onUpdate(response.data);
            setIsCommentModalOpen(false);
        } catch (error) {
            console.error('Failed to add comment', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEscalate = async () => {
        if (!confirm('Are you sure you want to escalate this complaint to the next stage?')) return;

        setIsProcessing(true);
        try {
            const response = await axios.post(`/api/complaints/${complaint.id}/escalate`);
            onUpdate(response.data);
        } catch (error) {
            console.error('Failed to escalate', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-slate-900">{complaint.title}</h2>
                        {complaint.confidential && <Lock className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>ID: {complaint.id}</span>
                        <span>•</span>
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Badge variant={isResolved ? "default" : "secondary"} className={isResolved ? "bg-green-600" : "bg-blue-600 text-white"}>
                    {complaint.status}
                </Badge>
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 text-sm uppercase text-slate-500">Description</h3>
                <p className="text-slate-800 whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-b pb-6">
                <Button variant="outline" size="sm" onClick={() => setIsCommentModalOpen(true)} disabled={isResolved}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment
                </Button>
                <Button variant="outline" size="sm" disabled={isResolved}>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                </Button>
                <div className="flex-1" />
                <Button
                    variant="default"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleEscalate}
                    disabled={isResolved || isProcessing}
                >
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Escalate
                </Button>
            </div>

            {/* Timeline */}
            <div>
                <h3 className="font-bold text-lg mb-6">Timeline & Activity</h3>
                <Timeline entries={complaint.timeline} currentStage={complaint.currentStage} />
            </div>

            <NewCommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                onSubmit={handleAddComment}
                isProcessing={isProcessing}
            />
        </div>
    );
}
