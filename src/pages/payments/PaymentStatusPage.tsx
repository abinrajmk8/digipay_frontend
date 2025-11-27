import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

export default function PaymentStatusPage() {
    const { id } = useParams();
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
                <p className="text-muted-foreground">Status for payment ID: {id}</p>
            </div>
        </div>
    );
}
