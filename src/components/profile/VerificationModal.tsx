import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (otp: string) => void;
    isProcessing: boolean;
    destination?: string;
    mockOtp?: string; // For demo purposes
}

export function VerificationModal({ isOpen, onClose, onConfirm, isProcessing, destination, mockOtp }: VerificationModalProps) {
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (isOpen) setOtp('');
    }, [isOpen]);

    const handleSubmit = () => {
        if (otp.length < 4) return;
        onConfirm(otp);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify Action</DialogTitle>
                    <DialogDescription>
                        Please enter the OTP sent to {destination || 'your registered contact'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">One-Time Password</label>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                            disabled={isProcessing}
                        />
                        {mockOtp && (
                            <p className="text-xs text-muted-foreground bg-slate-100 p-2 rounded">
                                Demo: Use OTP <strong>{mockOtp}</strong>
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing || otp.length < 4} className="bg-dte-blue">
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
