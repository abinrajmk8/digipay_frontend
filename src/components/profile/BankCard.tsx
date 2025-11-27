import { BankDetails } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface BankCardProps {
    bank: BankDetails;
    onVerifyPhone: () => void;
    isVerifying: boolean;
}

export function BankCard({ bank, onVerifyPhone, isVerifying }: BankCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bank Details</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-2xl font-bold">{bank.bankName}</div>
                        <p className="text-xs text-muted-foreground">IFSC: {bank.ifsc}</p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Account Number</p>
                            <p className="text-sm text-muted-foreground font-mono">{bank.accountMasked}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Linked Phone Number</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{bank.linkedPhone}</span>
                                {bank.phoneVerified ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                        <AlertCircle className="mr-1 h-3 w-3" /> Unverified
                                    </Badge>
                                )}
                            </div>

                            {!bank.phoneVerified && (
                                <Button size="sm" variant="outline" onClick={onVerifyPhone} disabled={isVerifying}>
                                    Verify Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
