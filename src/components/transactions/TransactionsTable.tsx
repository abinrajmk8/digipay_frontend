import { Transaction } from '@/types/transaction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionsTableProps {
    transactions: Transaction[];
    onView: (transaction: Transaction) => void;
    onDownloadReceipt: (transaction: Transaction) => void;
}

export function TransactionsTable({ transactions, onView, onDownloadReceipt }: TransactionsTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'PENDING': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
            case 'FAILED': return 'bg-red-100 text-red-800 hover:bg-red-100';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="rounded-md border bg-white">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                    No transactions found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn) => (
                                <tr key={txn.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{txn.id}</td>
                                    <td className="p-4 align-middle">{format(new Date(txn.date), 'dd MMM yyyy')}</td>
                                    <td className="p-4 align-middle">
                                        <span className="capitalize">{txn.type.replace('_', ' ').toLowerCase()}</span>
                                    </td>
                                    <td className="p-4 align-middle font-semibold">{formatCurrency(txn.amount)}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant="secondary" className={getStatusColor(txn.status)}>
                                            {txn.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onView(txn)} title="View Details">
                                                <Eye className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            {txn.status === 'SUCCESS' && (
                                                <Button variant="ghost" size="icon" onClick={() => onDownloadReceipt(txn)} title="Download Receipt">
                                                    <Download className="h-4 w-4 text-dte-blue" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
