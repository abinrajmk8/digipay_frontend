import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { StatusCards } from '@/components/transactions/StatusCards';
import { FilterBar } from '@/components/transactions/FilterBar';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetailDrawer } from '@/components/transactions/TransactionDetailDrawer';
import { Transaction, TransactionFilters } from '@/types/transaction';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<TransactionFilters>({
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortDir: 'desc'
    });
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value.toString());
            });

            const response = await axios.get(`/api/transactions?${params.toString()}`);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            sortBy: 'date',
            sortDir: 'desc'
        });
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await axios.post('/api/transactions/export', filters, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions_export_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export transactions');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadReceipt = async (transaction: Transaction) => {
        try {
            const response = await axios.get(`/api/transactions/${transaction.id}/receipt`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${transaction.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Receipt download failed', err);
            alert('Failed to download receipt');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
                    </div>

                    <StatusCards
                        transactions={transactions} // Note: Ideally this should come from a separate stats endpoint or be calculated on full dataset
                        onFilterStatus={(status) => handleFilterChange('status', status)}
                        currentFilter={filters.status}
                    />

                    <FilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onExport={handleExport}
                        isExporting={isExporting}
                    />

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-dte-blue" />
                        </div>
                    ) : (
                        <TransactionsTable
                            transactions={transactions}
                            onView={setSelectedTransaction}
                            onDownloadReceipt={handleDownloadReceipt}
                        />
                    )}
                </div>
            </div>

            <TransactionDetailDrawer
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                onDownloadReceipt={handleDownloadReceipt}
            />
        </div>
    );
}
