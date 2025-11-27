import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/types/profile';
import { BankCard } from '@/components/profile/BankCard';
import { VerificationModal } from '@/components/profile/VerificationModal';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { Loader2, User, Mail, Phone, MapPin, ChevronDown, ChevronUp, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Verification State
    const [verificationState, setVerificationState] = useState<{
        isOpen: boolean;
        verificationId: string;
        field: string;
        newValue: any;
        mockOtp?: string;
    }>({ isOpen: false, verificationId: '', field: '', newValue: null });

    const [isVerifying, setIsVerifying] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/user/me');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setEditValue('');
    };

    const handleSave = async (field: string) => {
        if (!profile) return;

        // Check if sensitive field
        const sensitiveFields = ['email', 'phone', 'bank.linkedPhone'];
        const isSensitive = sensitiveFields.includes(field);

        if (isSensitive) {
            setIsVerifying(true);
            try {
                const response = await axios.post('/api/verify/send', {
                    field,
                    newValue: editValue
                });
                setVerificationState({
                    isOpen: true,
                    verificationId: response.data.verificationId,
                    field,
                    newValue: editValue,
                    mockOtp: response.data.mockOtp
                });
            } catch (err) {
                console.error('Verification init failed', err);
            } finally {
                setIsVerifying(false);
            }
        } else {
            // Direct update for non-sensitive
            try {
                const updates: any = {};
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    updates[parent] = { ...(profile as any)[parent], [child]: editValue };
                } else {
                    updates[field] = editValue;
                }

                await axios.put('/api/user/me', updates);
                await fetchProfile();
                setEditingField(null);
            } catch (err) {
                console.error('Update failed', err);
            }
        }
    };

    const handleVerifyConfirm = async (otp: string) => {
        setIsVerifying(true);
        try {
            await axios.post('/api/verify/confirm', {
                verificationId: verificationState.verificationId,
                otp
            });
            setVerificationState(prev => ({ ...prev, isOpen: false }));
            setEditingField(null);
            await fetchProfile();
            alert('Update verified and saved successfully!');
        } catch (err) {
            alert('Verification failed. Invalid OTP.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleBankPhoneVerify = async () => {
        if (!profile?.bank?.linkedPhone) return;

        setIsVerifying(true);
        try {
            const response = await axios.post('/api/user/bank/verify-phone', {
                phone: profile.bank.linkedPhone
            });
            setVerificationState({
                isOpen: true,
                verificationId: response.data.verificationId,
                field: 'bank.phoneVerified',
                newValue: true,
                mockOtp: response.data.mockOtp
            });
        } catch (err) {
            console.error('Bank verify init failed', err);
        } finally {
            setIsVerifying(false);
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-dte-blue" />
                </div>
            </div>
        );
    }

    const renderEditableField = (label: string, value: string, field: string, icon?: React.ReactNode) => {
        const isEditing = editingField === field;

        return (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-dte-blue/50 transition-colors group">
                <div className="flex items-center gap-3 flex-1">
                    {icon && <div className="text-muted-foreground">{icon}</div>}
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase">{label}</p>
                        {isEditing ? (
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 mt-1"
                                autoFocus
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-900">{value}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    {isEditing ? (
                        <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleSave(field)}>
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEdit(field, value)}
                        >
                            <Edit2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                            Change Password
                        </Button>
                    </div>

                    {/* Core Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-dte-blue" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-medium uppercase">Full Name</p>
                                <p className="text-sm font-medium text-slate-900">{profile.firstName} {profile.lastName}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <p className="text-xs text-muted-foreground font-medium uppercase">Registration Number</p>
                                <p className="text-sm font-medium text-slate-900">{profile.regNo}</p>
                            </div>
                            {renderEditableField('Email Address', profile.email, 'email', <Mail className="h-4 w-4" />)}
                            {renderEditableField('Phone Number', profile.phone, 'phone', <Phone className="h-4 w-4" />)}
                        </CardContent>
                    </Card>

                    {/* Expandable Section */}
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="w-full flex justify-between items-center bg-white border hover:bg-slate-50"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span className="font-semibold">
                                {isExpanded ? 'Hide Full Profile' : 'View Full Profile'}
                            </span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>

                        {isExpanded && (
                            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                                {/* Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <MapPin className="h-4 w-4" /> Address Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {renderEditableField('Address Line 1', profile.address?.line1 || '', 'address.line1')}
                                        {renderEditableField('City', profile.address?.city || '', 'address.city')}
                                        <div className="grid grid-cols-2 gap-4">
                                            {renderEditableField('State', profile.address?.state || '', 'address.state')}
                                            {renderEditableField('Pincode', profile.address?.pincode || '', 'address.pincode')}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Bank Details */}
                                {profile.bank && (
                                    <BankCard
                                        bank={profile.bank}
                                        onVerifyPhone={handleBankPhoneVerify}
                                        isVerifying={isVerifying}
                                    />
                                )}

                                {/* Academic Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Academic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-lg border">
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Course</p>
                                            <p className="text-sm font-medium">{profile.course}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border">
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Year</p>
                                            <p className="text-sm font-medium">{profile.year}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <VerificationModal
                isOpen={verificationState.isOpen}
                onClose={() => setVerificationState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleVerifyConfirm}
                isProcessing={isVerifying}
                mockOtp={verificationState.mockOtp}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}
