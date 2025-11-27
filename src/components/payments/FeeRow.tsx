import { FeeRecord } from '@/types/payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface FeeRowProps {
    fee: FeeRecord;
    onPay: (fee: FeeRecord) => void;
    onDownloadReceipt: (fee: FeeRecord) => void;
    isProcessing?: boolean;
}

export function FeeRow({ fee, onPay, onDownloadReceipt, isProcessing }: FeeRowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'PARTIAL': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
            default: return 'bg-red-100 text-red-800 hover:bg-red-100';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border-b last:border-0 hover:bg-slate-50 transition-colors">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="col-span-1 md:col-span-2">
                    <p className="font-medium text-slate-900">{fee.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border uppercase tracking-wider font-semibold text-[10px]">
                            {fee.type}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {format(new Date(fee.dueDate), 'dd MMM yyyy')}
                        </span>
                    </div>
                </div>

                <div className="text-left md:text-right font-semibold text-slate-900">
                    {formatCurrency(fee.amount)}
                </div>

                <div className="flex items-center justify-start md:justify-end gap-3">
                    <Badge variant="secondary" className={getStatusColor(fee.status)}>
                        {fee.status}
                    </Badge>

                    {fee.status === 'PAID' ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-dte-blue hover:text-dte-blue hover:bg-blue-50"
                            onClick={() => onDownloadReceipt(fee)}
                        >
                            <Download className="mr-2 h-3 w-3" />
                            Receipt
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="h-8 bg-dte-blue hover:bg-dte-blue/90"
                            onClick={() => onPay(fee)}
                            disabled={isProcessing}
                        >
                            <CreditCard className="mr-2 h-3 w-3" />
                            Pay Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
