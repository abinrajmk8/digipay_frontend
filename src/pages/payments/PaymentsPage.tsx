import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { SemesterCard } from '@/components/payments/SemesterCard';
import { PaymentConfirmModal } from '@/components/payments/PaymentConfirmModal';
import { SemesterSummary, FeeRecord } from '@/types/payment';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

export default function PaymentsPage() {
    const [semesters, setSemesters] = useState<SemesterSummary[]>([]);
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment Modal State
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedFees, setSelectedFees] = useState<FeeRecord[]>([]);
    const [paymentTotal, setPaymentTotal] = useState(0);
    const [paymentContext, setPaymentContext] = useState<'single' | 'semester'>('single');
    const [targetSemesterId, setTargetSemesterId] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [semesterFilter, setSemesterFilter] = useState<string>('all');

    const fetchFees = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user/fees?studentId=STU-1001');
            setSemesters(Array.isArray(response.data?.semesters) ? response.data.semesters : []);
            setFees(Array.isArray(response.data?.fees) ? response.data.fees : []);
        } catch (error) {
            console.error('Failed to fetch fees', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handlePayFee = (fee: FeeRecord) => {
        setSelectedFees([fee]);
        setPaymentTotal(fee.amount);
        setPaymentContext('single');
        setPaymentModalOpen(true);
    };

    const handlePaySemester = (semesterId: string) => {
        const semFees = fees.filter(f => f.semesterId === semesterId && f.status !== 'PAID');
        if (semFees.length === 0) return;

        const total = semFees.reduce((sum, f) => sum + f.amount, 0);
        setSelectedFees(semFees);
        setPaymentTotal(total);
        setPaymentContext('semester');
        setTargetSemesterId(semesterId);
        setPaymentModalOpen(true);
    };

    const handlePaymentConfirm = async (method: string) => {
        setIsProcessing(true);
        try {
            const payload = paymentContext === 'semester'
                ? { semesterId: targetSemesterId, method }
                : { feeId: selectedFees[0].id, method };

            await axios.post('/api/payments/pay', payload);
            await fetchFees(); // Refresh data in background
        } catch (error) {
            console.error('Payment failed', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadReceipt = async (fee: FeeRecord) => {
        try {
            const response = await axios.get(`/api/payments/${fee.id}/receipt`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${fee.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Receipt download failed', err);
            alert('Failed to download receipt');
        }
    };

    // Wrapper for modal download action
    const handleModalDownload = () => {
        if (selectedFees.length > 0) {
            // If multiple fees (semester pay), just download the first one for demo
            // or ideally fetch a combined receipt.
            // For now, let's download the first fee's receipt if available, 
            // or just trigger a generic download since we refreshed fees.
            // We need the updated fee record with receiptId.
            const updatedFee = fees.find(f => f.id === selectedFees[0].id);
            if (updatedFee) {
                handleDownloadReceipt(updatedFee);
            } else {
                // Fallback if state update hasn't propagated yet (unlikely with await fetchFees)
                handleDownloadReceipt(selectedFees[0]);
            }
        }
    };

    // Filtering Logic
    const filteredSemesters = semesters
        .filter(sem => {
            if (semesterFilter !== 'all' && sem.id !== semesterFilter) return false;
            if (statusFilter !== 'all' && sem.status !== statusFilter) return false;
            return true;
        })
        .sort((a, b) => b.semesterNumber - a.semesterNumber); // Recent semesters first

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Fee Payments</h1>
                            <p className="text-muted-foreground">Manage and pay your semester fees.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                <SelectTrigger className="w-[140px] bg-white">
                                    <SelectValue placeholder="Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Semesters</SelectItem>
                                    {semesters.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] bg-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                                    <SelectItem value="PARTIAL">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-dte-blue" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSemesters.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    No semesters found matching your filters.
                                </div>
                            ) : (
                                filteredSemesters.map(sem => (
                                    <SemesterCard
                                        key={sem.id}
                                        semester={sem}
                                        fees={fees.filter(f => f.semesterId === sem.id)}
                                        onPaySemester={handlePaySemester}
                                        onPayFee={handlePayFee}
                                        onDownloadReceipt={handleDownloadReceipt}
                                        isProcessing={isProcessing}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <PaymentConfirmModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handlePaymentConfirm}
                amount={paymentTotal}
                feeDescription={
                    paymentContext === 'semester'
                        ? `Full Payment for ${semesters.find(s => s.id === targetSemesterId)?.title}`
                        : selectedFees[0]?.description
                }
                isProcessing={isProcessing}
                onDownloadReceipt={handleModalDownload}
            />
        </div>
    );
}
