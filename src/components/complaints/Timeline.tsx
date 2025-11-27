import { TimelineEntry } from '@/types/complaint';
import { CheckCircle2, Clock } from 'lucide-react';

interface TimelineProps {
    entries: TimelineEntry[];
    currentStage?: string;
}

export function Timeline({ entries }: TimelineProps) {

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {entries.map((entry, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {index === entries.length - 1 ? (
                            <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">{entry.stageName}</div>
                            <time className="font-caveat font-medium text-indigo-500 text-xs">
                                {new Date(entry.timestamp).toLocaleString()}
                            </time>
                        </div>
                        <div className="text-slate-500 text-sm">
                            <span className="font-medium text-slate-900">{entry.actor}</span>
                            {entry.note && (
                                <p className="mt-1 text-slate-600 italic">"{entry.note}"</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
