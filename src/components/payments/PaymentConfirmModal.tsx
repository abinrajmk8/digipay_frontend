import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FeeRecord } from "@/types/payment"
import { Loader2, CreditCard, Wallet, Banknote, CheckCircle2, Download, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PaymentConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (method: string) => Promise<void>
    amount: number
    feeDescription: string
    isProcessing: boolean
    onDownloadReceipt?: () => void
}

type PaymentStep = 'REVIEW' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export function PaymentConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    amount,
    feeDescription,
    isProcessing: externalProcessing,
    onDownloadReceipt
}: PaymentConfirmModalProps) {
    const [step, setStep] = useState<PaymentStep>('REVIEW');
    const [method, setMethod] = useState('CARD');
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('REVIEW');
            setError(null);
            setMethod('CARD');
        }
    }, [isOpen]);

    // Sync external processing state
    useEffect(() => {
        if (externalProcessing) {
            setStep('PROCESSING');
        }
    }, [externalProcessing]);

    const handleConfirm = async () => {
        setError(null);
        setStep('PROCESSING');
        try {
            await onConfirm(method);
            setStep('SUCCESS');
        } catch (err) {
            console.error(err);
            setStep('FAILED');
            setError('Payment failed. Please try again.');
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'REVIEW' && 'Confirm Payment'}
                        {step === 'PROCESSING' && 'Processing Payment'}
                        {step === 'SUCCESS' && 'Payment Successful'}
                        {step === 'FAILED' && 'Payment Failed'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'REVIEW' && 'Please review the details and select a payment method.'}
                        {step === 'PROCESSING' && 'Please wait while we process your secure payment.'}
                        {step === 'SUCCESS' && 'Your transaction has been completed successfully.'}
                        {step === 'FAILED' && 'There was an issue processing your payment.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 'REVIEW' && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Description</span>
                                    <span className="font-medium text-right">{feeDescription}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(amount)}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Select Payment Method</label>
                                <div className="grid gap-3">
                                    <div
                                        className={cn("flex items-center space-x-4 border p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-all", method === 'CARD' && "border-dte-blue bg-blue-50 ring-1 ring-dte-blue")}
                                        onClick={() => setMethod('CARD')}
                                    >
                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Credit / Debit Card</p>
                                        </div>
                                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", method === 'CARD' ? "border-dte-blue" : "border-slate-300")}>
                                            {method === 'CARD' && <div className="h-2 w-2 rounded-full bg-dte-blue" />}
                                        </div>
                                    </div>
                                    <div
                                        className={cn("flex items-center space-x-4 border p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-all", method === 'UPI' && "border-dte-blue bg-blue-50 ring-1 ring-dte-blue")}
                                        onClick={() => setMethod('UPI')}
                                    >
                                        <Wallet className="h-5 w-5 text-orange-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">UPI / Wallets</p>
                                        </div>
                                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", method === 'UPI' ? "border-dte-blue" : "border-slate-300")}>
                                            {method === 'UPI' && <div className="h-2 w-2 rounded-full bg-dte-blue" />}
                                        </div>
                                    </div>
                                    <div
                                        className={cn("flex items-center space-x-4 border p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-all", method === 'NETBANK' && "border-dte-blue bg-blue-50 ring-1 ring-dte-blue")}
                                        onClick={() => setMethod('NETBANK')}
                                    >
                                        <Banknote className="h-5 w-5 text-green-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Netbanking</p>
                                        </div>
                                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", method === 'NETBANK' ? "border-dte-blue" : "border-slate-300")}>
                                            {method === 'NETBANK' && <div className="h-2 w-2 rounded-full bg-dte-blue" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-dte-blue animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-slate-400" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground animate-pulse">Contacting Payment Gateway...</p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                                <p className="text-muted-foreground">
                                    Amount of <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span> has been paid.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-md w-full text-sm text-muted-foreground border">
                                Transaction ID: <span className="font-mono text-slate-700">TXN-{Date.now().toString().slice(-8)}</span>
                            </div>
                        </div>
                    )}

                    {step === 'FAILED' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-900">Payment Failed</h3>
                                <p className="text-red-600">{error}</p>
                            </div>
                            <Button variant="outline" onClick={() => setStep('REVIEW')}>Try Again</Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    {step === 'REVIEW' && (
                        <>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleConfirm} className="bg-dte-blue hover:bg-dte-blue/90 w-full sm:w-auto">
                                Pay {formatCurrency(amount)}
                            </Button>
                        </>
                    )}

                    {step === 'PROCESSING' && (
                        <Button disabled className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </Button>
                    )}

                    {step === 'SUCCESS' && (
                        <>
                            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
                            {onDownloadReceipt && (
                                <Button onClick={onDownloadReceipt} className="bg-dte-blue hover:bg-dte-blue/90 w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Receipt
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
