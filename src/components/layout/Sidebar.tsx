import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    CreditCard,
    History,
    MessageSquareWarning,
    User,

    LogOut
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { href: '/payments', icon: CreditCard, label: t('nav.payments') },
        { href: '/transactions', icon: History, label: t('nav.transactions') },
        { href: '/complaints', icon: MessageSquareWarning, label: t('nav.complaints') },
        { href: '/profile', icon: User, label: t('nav.profile') },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-50 border-r min-h-[calc(100vh-4rem)]">
            <div className="p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            location.pathname === item.href
                                ? "bg-dte-blue text-white"
                                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="mt-auto p-4 border-t">
                <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                </button>
            </div>
        </div>
    );
}
