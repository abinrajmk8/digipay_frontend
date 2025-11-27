import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="container px-4 mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-dte-blue/10 text-dte-blue mb-8">
                        Official Payment Portal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        {t('landing.heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        {t('landing.heroSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-dte-gold text-slate-900 hover:bg-dte-gold/90 text-lg px-8" onClick={() => navigate('/auth/login')}>
                            {t('landing.payNow')} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/payments/status/check')}>
                            {t('landing.checkStatus')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-dte-blue">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                            <p className="text-slate-600">Bank-grade security for all your transactions with multi-factor authentication.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-dte-blue">
                                <Clock className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Receipts</h3>
                            <p className="text-slate-600">Get digital receipts instantly after payment. Download anytime from your dashboard.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-dte-blue">
                                <CreditCard className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Multiple Modes</h3>
                            <p className="text-slate-600">Pay using UPI, Credit/Debit Cards, Netbanking or generate offline challans.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
