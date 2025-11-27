import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Complaint } from '@/types/complaint';
import { ComplaintDetail } from '@/pages/complaints/ComplaintDetail';
import { NewComplaintForm } from '@/pages/complaints/NewComplaintForm';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ComplaintsPage() {
    const { t } = useTranslation();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/complaints');
            setComplaints(response.data);
            if (response.data.length > 0 && !selectedComplaintId && !isCreatingNew) {
                setSelectedComplaintId(response.data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch complaints', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleComplaintUpdate = (updatedComplaint: Complaint) => {
        setComplaints(prev => prev.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
    };

    const handleNewComplaintSuccess = (newComplaint: Complaint) => {
        setComplaints(prev => [newComplaint, ...prev]);
        setSelectedComplaintId(newComplaint.id);
        setIsCreatingNew(false);
    };

    const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t('nav.complaints')}</h1>
                        <p className="text-sm text-muted-foreground">Track and manage your grievances</p>
                    </div>
                    <Button onClick={() => { setIsCreatingNew(true); setSelectedComplaintId(null); }} className="bg-dte-blue">
                        <Plus className="mr-2 h-4 w-4" />
                        Register New Complaint
                    </Button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* List Pane */}
                    <div className="w-1/3 border-r bg-white flex flex-col min-w-[300px]">
                        <div className="p-4 border-b space-y-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search complaints..." className="pl-9" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1"><Filter className="mr-2 h-3 w-3" /> Filter</Button>
                                <Button variant="outline" size="sm" className="flex-1">Sort</Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading...</div>
                            ) : complaints.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No complaints found.</div>
                            ) : (
                                <div className="divide-y">
                                    {complaints.map(complaint => (
                                        <div
                                            key={complaint.id}
                                            onClick={() => { setSelectedComplaintId(complaint.id); setIsCreatingNew(false); }}
                                            className={cn(
                                                "p-4 cursor-pointer hover:bg-slate-50 transition-colors",
                                                selectedComplaintId === complaint.id ? "bg-blue-50 border-l-4 border-dte-blue" : "border-l-4 border-transparent"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-slate-900 line-clamp-1">{complaint.title}</span>
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                                                    complaint.status === 'RESOLVED' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {complaint.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-2">{complaint.description}</p>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{complaint.id}</span>
                                                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail Pane */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
                        {isCreatingNew ? (
                            <div className="max-w-2xl mx-auto">
                                <NewComplaintForm
                                    onSuccess={handleNewComplaintSuccess}
                                    onCancel={() => { setIsCreatingNew(false); if (complaints.length > 0) setSelectedComplaintId(complaints[0].id); }}
                                />
                            </div>
                        ) : selectedComplaint ? (
                            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 md:p-8">
                                <ComplaintDetail
                                    complaint={selectedComplaint}
                                    onUpdate={handleComplaintUpdate}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Select a complaint to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
