import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NewCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (note: string) => void;
    isProcessing: boolean;
}

export function NewCommentModal({ isOpen, onClose, onSubmit, isProcessing }: NewCommentModalProps) {
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!note.trim()) return;
        onSubmit(note);
        setNote('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Note</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your comment or update..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={isProcessing}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing || !note.trim()} className="bg-dte-blue">
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
