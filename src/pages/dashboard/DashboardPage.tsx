import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8 space-y-8 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back, John Doe (Reg: DTE2023001)</p>
                    </div>
                    <Button onClick={() => navigate('/payments/new')} className="bg-dte-gold text-slate-900 hover:bg-dte-gold/90">
                        <Plus className="mr-2 h-4 w-4" /> New Payment
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹ 45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last semester</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹ 2,500.00</div>
                            <p className="text-xs text-muted-foreground">Due by 30 Nov 2025</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹ 0.00</div>
                            <p className="text-xs text-muted-foreground">No active refunds</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">All clear</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                            TF
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Tuition Fee - Sem {i}</p>
                                            <p className="text-sm text-muted-foreground">Paid via UPI</p>
                                        </div>
                                        <div className="ml-auto font-medium">+₹ 12,000.00</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Exam fee payment window open</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Profile updated successfully</p>
                                        <p className="text-xs text-muted-foreground">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
