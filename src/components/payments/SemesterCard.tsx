import { useState } from 'react';
import { SemesterSummary, FeeRecord } from '@/types/payment';
import { FeeRow } from '@/components/payments/FeeRow';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface SemesterCardProps {
    semester: SemesterSummary;
    fees: FeeRecord[];
    onPaySemester: (semesterId: string) => void;
    onPayFee: (fee: FeeRecord) => void;
    onDownloadReceipt: (fee: FeeRecord) => void; // For individual fees
    isProcessing: boolean;
}

export function SemesterCard({ semester, fees, onPaySemester, onPayFee, onDownloadReceipt, isProcessing }: SemesterCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

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
        <Card className="overflow-hidden border-l-4 border-l-dte-blue">
            <CardHeader className="p-0">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-full">
                            {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{semester.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {fees.length} Fees • Total: {formatCurrency(semester.totalAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-muted-foreground uppercase font-medium">Status</p>
                            <Badge variant="secondary" className={getStatusColor(semester.status)}>
                                {semester.status}
                            </Badge>
                        </div>

                        <div onClick={(e) => e.stopPropagation()}>
                            {semester.status === 'PAID' ? (
                                <div className="flex items-center text-green-600 font-medium text-sm">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Paid
                                </div>
                            ) : (
                                <Button
                                    onClick={() => onPaySemester(semester.id)}
                                    disabled={isProcessing}
                                    className="bg-dte-blue hover:bg-dte-blue/90"
                                >
                                    Pay All ({formatCurrency(semester.totalAmount - semester.totalPaidAmount)})
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="p-0 border-t bg-slate-50/50">
                    <div className="divide-y">
                        {fees.map(fee => (
                            <FeeRow
                                key={fee.id}
                                fee={fee}
                                onPay={onPayFee}
                                onDownloadReceipt={onDownloadReceipt}
                                isProcessing={isProcessing}
                            />
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
