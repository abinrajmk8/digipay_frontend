import { Profile, VerificationRequest } from '@/types/profile';

export let demoProfile: Profile = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    regNo: 'DTE2023001',
    email: 'john@example.com',
    phone: '9876543210',
    dob: '2003-05-15',
    course: 'B.Tech Computer Science',
    year: 3,
    address: {
        line1: 'Room 304, Men\'s Hostel',
        line2: 'College of Engineering',
        city: 'Trivandrum',
        state: 'Kerala',
        pincode: '695016'
    },
    bank: {
        bankName: 'State Bank of India',
        accountMasked: 'XXXXXX1234',
        accountLast4: '1234',
        ifsc: 'SBIN0001234',
        linkedPhone: '9876543210',
        phoneVerified: false
    },
    emergencyContact: {
        name: 'Jane Doe',
        phone: '9876543211'
    },
    updatedAt: new Date().toISOString()
};

export const verificationRequests: Map<string, VerificationRequest> = new Map();
