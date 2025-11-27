import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionFilters } from '@/types/transaction';
import { Download, Search, X, Loader2 } from 'lucide-react';

interface FilterBarProps {
    filters: TransactionFilters;
    onFilterChange: (key: keyof TransactionFilters, value: any) => void;
    onClearFilters: () => void;
    onExport: () => void;
    isExporting: boolean;
}

export function FilterBar({ filters, onFilterChange, onClearFilters, onExport, isExporting }: FilterBarProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex flex-1 flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID, Name, Reg No..."
                        value={filters.q || ''}
                        onChange={(e) => onFilterChange('q', e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={filters.type || "all"} onValueChange={(val) => onFilterChange('type', val === "all" ? "" : val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="EXAM_FEE">Exam Fee</SelectItem>
                        <SelectItem value="SEM_FEE">Semester Fee</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.status || "all"} onValueChange={(val) => onFilterChange('status', val === "all" ? "" : val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                </Select>

                {(filters.q || filters.type || filters.status) && (
                    <Button variant="ghost" size="icon" onClick={onClearFilters} title="Clear Filters">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Export CSV
                </Button>
            </div>
        </div>
    );
}
