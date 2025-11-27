import { FeeRecord } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists or will use a simple span
import { Download, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FeeTableProps {
    fees: FeeRecord[];
    onPay: (fee: FeeRecord) => void;
    onDownloadReceipt: (fee: FeeRecord) => void;
    isProcessing?: boolean;
}

export function FeeTable({ fees, onPay, onDownloadReceipt, isProcessing }: FeeTableProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white shadow hover:bg-green-500/80">Paid</span>;
            case 'PARTIAL':
                return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80">Partial</span>;
            default:
                return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-500 text-white shadow hover:bg-red-500/80">Unpaid</span>;
        }
    };

    return (
        <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('payment.feeType', 'Fee Type')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('payment.dueDate', 'Due Date')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('payment.amount', 'Amount')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t('payment.status', 'Status')}</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">{t('payment.action', 'Action')}</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {fees.map((fee) => (
                        <tr key={fee.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle font-medium">
                                <div>{fee.description}</div>
                                <div className="text-xs text-muted-foreground">{fee.code}</div>
                            </td>
                            <td className="p-4 align-middle">
                                {new Date(fee.dueDate).toLocaleDateString()}
                            </td>
                            <td className="p-4 align-middle font-bold">
                                {fee.currency} {fee.amount.toLocaleString()}
                            </td>
                            <td className="p-4 align-middle">
                                {getStatusBadge(fee.status)}
                            </td>
                            <td className="p-4 align-middle text-right">
                                {fee.status === 'PAID' ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDownloadReceipt(fee)}
                                        aria-label={`Download receipt for ${fee.description}`}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('payment.downloadReceipt', 'Receipt')}
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="bg-dte-blue hover:bg-dte-blue/90"
                                        onClick={() => onPay(fee)}
                                        disabled={isProcessing}
                                        aria-label={`Pay ${fee.description}`}
                                    >
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {t('payment.pay', 'Pay')}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
