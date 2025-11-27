import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardsProps {
    transactions: Transaction[];
    onFilterStatus: (status: string | undefined) => void;
    currentFilter: string | undefined;
}

export function StatusCards({ transactions, onFilterStatus, currentFilter }: StatusCardsProps) {
    const total = transactions.length;
    const success = transactions.filter(t => t.status === 'SUCCESS');
    const pending = transactions.filter(t => t.status === 'PENDING');
    const failed = transactions.filter(t => t.status === 'FAILED');

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const successAmount = success.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = pending.reduce((sum, t) => sum + t.amount, 0);
    const failedAmount = failed.reduce((sum, t) => sum + t.amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const cards = [
        {
            title: 'Total Transactions',
            count: total,
            amount: totalAmount,
            icon: ArrowUpRight,
            status: undefined,
            color: 'text-slate-600',
            bg: 'bg-slate-50'
        },
        {
            title: 'Successful',
            count: success.length,
            amount: successAmount,
            icon: CheckCircle2,
            status: 'SUCCESS',
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: 'Pending',
            count: pending.length,
            amount: pendingAmount,
            icon: Clock,
            status: 'PENDING',
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            title: 'Failed',
            count: failed.length,
            amount: failedAmount,
            icon: XCircle,
            status: 'FAILED',
            color: 'text-red-600',
            bg: 'bg-red-50'
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-2",
                        currentFilter === card.status ? "border-dte-blue ring-2 ring-dte-blue/20" : "border-transparent",
                        card.bg
                    )}
                    onClick={() => onFilterStatus(card.status)}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <card.icon className={cn("h-4 w-4", card.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.count}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(card.amount)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
