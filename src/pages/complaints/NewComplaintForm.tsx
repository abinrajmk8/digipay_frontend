import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import axios from 'axios';
import { Complaint } from '@/types/complaint';

interface NewComplaintFormProps {
    onSuccess: (complaint: Complaint) => void;
    onCancel: () => void;
}

export function NewComplaintForm({ onSuccess, onCancel }: NewComplaintFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/complaints', {
                ...data,
                studentId: 'STU-1001', // Mock student ID
                attachments: [] // Mock attachments
            });
            onSuccess(response.data);
        } catch (error) {
            console.error('Failed to create complaint', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register New Complaint</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            {...register('title', { required: true })}
                            placeholder="Brief summary of the issue"
                        />
                        {errors.title && <span className="text-xs text-red-500">Title is required</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            {...register('description', { required: true })}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Detailed description of your grievance..."
                        />
                        {errors.description && <span className="text-xs text-red-500">Description is required</span>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            {...register('confidential')}
                            id="confidential"
                            className="h-4 w-4 rounded border-gray-300 text-dte-blue focus:ring-dte-blue"
                        />
                        <label htmlFor="confidential" className="text-sm font-medium">Mark as Confidential</label>
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-slate-400" />
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-dte-blue">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" className="bg-dte-blue" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Complaint
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
