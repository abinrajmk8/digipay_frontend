export interface Address {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

export interface BankDetails {
    bankName?: string;
    accountMasked?: string;
    accountLast4?: string;
    ifsc?: string;
    linkedPhone?: string;
    phoneVerified?: boolean;
}

export interface EmergencyContact {
    name?: string;
    phone?: string;
}

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    regNo: string;
    email: string;
    phone: string;
    dob?: string;
    course?: string;
    year?: number;
    address?: Address;
    bank?: BankDetails;
    emergencyContact?: EmergencyContact;
    updatedAt?: string;
}

export interface VerificationRequest {
    verificationId: string;
    field: string;
    newValue: any;
    otp: string;
    expiresAt: number;
}
