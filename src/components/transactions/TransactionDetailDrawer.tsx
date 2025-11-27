import { Transaction } from '@/types/transaction';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'; // Assuming Sheet component exists or using Dialog as fallback
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, CreditCard, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionDetailDrawerProps {
    transaction: Transaction | null;
    onClose: () => void;
    onDownloadReceipt: (transaction: Transaction) => void;
}

export function TransactionDetailDrawer({ transaction, onClose, onDownloadReceipt }: TransactionDetailDrawerProps) {
    if (!transaction) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Dialog open={!!transaction} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Transaction Details</span>
                        <Badge variant="outline" className="ml-2">{transaction.id}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        View complete details for this transaction.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-lg flex items-center justify-between ${transaction.status === 'SUCCESS' ? 'bg-green-50 text-green-800' :
                            transaction.status === 'PENDING' ? 'bg-amber-50 text-amber-800' :
                                'bg-red-50 text-red-800'
                        }`}>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
                            <span className="text-lg font-bold">{transaction.status}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold uppercase tracking-wider">Amount</span>
                            <span className="block text-2xl font-bold">{formatCurrency(transaction.amount)}</span>
                        </div>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase">Date & Time</span>
                            </div>
                            <p className="text-sm font-medium">{format(new Date(transaction.date), 'PPP p')}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase">Payment Method</span>
                            </div>
                            <p className="text-sm font-medium">{transaction.paymentMethod}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase">Type</span>
                            </div>
                            <p className="text-sm font-medium capitalize">{transaction.type.replace('_', ' ').toLowerCase()}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase">Payer</span>
                            </div>
                            <p className="text-sm font-medium">{transaction.payer.name} ({transaction.payer.regNo})</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    {transaction.timeline && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold border-b pb-2">Timeline</h4>
                            <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-1">
                                {transaction.timeline.map((event, idx) => (
                                    <div key={idx} className="relative pl-4">
                                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-slate-100 border-2 border-white ring-1 ring-slate-200" />
                                        <p className="text-sm font-medium">{event.event}</p>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{event.actor}</span>
                                            <span>{format(new Date(event.timestamp), 'p')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gateway Response (Debug/Admin view style) */}
                    {transaction.gatewayResponse && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold border-b pb-2">Gateway Response</h4>
                            <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-xs overflow-x-auto">
                                {JSON.stringify(transaction.gatewayResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    {transaction.status === 'SUCCESS' && (
                        <Button onClick={() => onDownloadReceipt(transaction)} className="bg-dte-blue">
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
