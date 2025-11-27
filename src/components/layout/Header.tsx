import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, Menu } from 'lucide-react';

export default function Header() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ml' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Placeholder for Logo */}
                    <div className="w-10 h-10 bg-dte-blue rounded-full flex items-center justify-center text-white font-bold">
                        DTE
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-lg font-bold text-dte-blue">{t('app.title')}</h1>
                        <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium hover:text-dte-blue">{t('nav.home')}</Link>
                    <Link to="/help" className="text-sm font-medium hover:text-dte-blue">{t('nav.help')}</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle Language">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">{i18n.language === 'en' ? 'Malayalam' : 'English'}</span>
                    </Button>
                    <Button variant="default" className="hidden md:flex gap-2" onClick={() => navigate('/auth/login')}>
                        <LogIn className="h-4 w-4" />
                        {t('nav.login')}
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
