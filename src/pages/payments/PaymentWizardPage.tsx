import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, ChevronRight, ChevronLeft, Upload, CreditCard, Wallet, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    { id: 1, title: 'Payment Type' },
    { id: 2, title: 'Payer Info' },
    { id: 3, title: 'Fee Details' },
    { id: 4, title: 'Documents' },
    { id: 5, title: 'Payment Method' },
    { id: 6, title: 'Review' },
];

export default function PaymentWizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        paymentType: '',
        amount: 0,
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePayment = () => {
        // Mock payment creation
        navigate('/payments/status/PAY123456');
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8 bg-slate-50/50">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">New Payment</h2>
                        <p className="text-muted-foreground">Complete the steps below to make a fee payment.</p>
                    </div>

                    {/* Stepper */}
                    <div className="relative flex items-center justify-between mb-8">
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10" />
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                                    currentStep > step.id ? "bg-green-500 border-green-500 text-white" :
                                        currentStep === step.id ? "bg-dte-blue border-dte-blue text-white" :
                                            "bg-white border-slate-300 text-slate-500"
                                )}>
                                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                                </div>
                                <span className="text-xs mt-2 font-medium text-slate-600 hidden sm:block">{step.title}</span>
                            </div>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                            <CardDescription>Step {currentStep} of {steps.length}</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[300px]">
                            {currentStep === 1 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {['Tuition Fee', 'Exam Fee', 'Hostel Fee', 'Bus Fee', 'Fine', 'Other'].map((type) => (
                                        <button
                                            key={type}
                                            className={cn(
                                                "p-4 border rounded-lg text-left hover:border-dte-blue hover:bg-blue-50 transition-all",
                                                formData.paymentType === type ? "border-dte-blue bg-blue-50 ring-1 ring-dte-blue" : ""
                                            )}
                                            onClick={() => setFormData({ ...formData, paymentType: type })}
                                        >
                                            <span className="font-medium">{type}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Name</label>
                                            <Input defaultValue="John Doe" disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Register No</label>
                                            <Input defaultValue="DTE2023001" disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Course</label>
                                        <Input defaultValue="B.Tech Computer Science" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input defaultValue="john@example.com" />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                                        <span>Tuition Fee (Semester 4)</span>
                                        <span className="font-bold">₹ 12,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                                        <span>Library Fee</span>
                                        <span className="font-bold">₹ 500.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md text-green-600">
                                        <span>Merit Scholarship</span>
                                        <span className="font-bold">- ₹ 2,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 border-t text-lg font-bold">
                                        <span>Total Payable</span>
                                        <span>₹ 10,500.00</span>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                        <Upload className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Upload Supporting Documents</p>
                                        <p className="text-sm text-muted-foreground">Drag and drop or click to upload (PDF, JPG, max 10MB)</p>
                                    </div>
                                    <Button variant="outline">Select Files</Button>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="grid gap-4">
                                    <div className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer hover:bg-slate-50">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Credit / Debit Card</p>
                                            <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                                        </div>
                                        <input type="radio" name="payment" className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer hover:bg-slate-50">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                            <Wallet className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">UPI / Wallets</p>
                                            <p className="text-sm text-muted-foreground">GPay, PhonePe, Paytm</p>
                                        </div>
                                        <input type="radio" name="payment" className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer hover:bg-slate-50">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Offline Challan</p>
                                            <p className="text-sm text-muted-foreground">Print and pay at bank</p>
                                        </div>
                                        <input type="radio" name="payment" className="h-4 w-4" />
                                    </div>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                        <h3 className="font-bold mb-4">Payment Summary</h3>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Payment Type</span>
                                            <span className="font-medium">{formData.paymentType || 'Tuition Fee'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Payer</span>
                                            <span className="font-medium">John Doe</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="font-bold">₹ 10,500.00</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Transaction Password</label>
                                        <Input type="password" placeholder="Enter your transaction password" />
                                        <p className="text-xs text-muted-foreground">Required for payments above ₹ 5,000</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            {currentStep < steps.length ? (
                                <Button onClick={nextStep} className="bg-dte-blue hover:bg-dte-blue/90">
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700 text-white">
                                    Confirm & Pay ₹ 10,500
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
