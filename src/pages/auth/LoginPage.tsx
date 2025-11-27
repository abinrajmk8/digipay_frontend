import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isInstitution, setIsInstitution] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [showOTP, setShowOTP] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);

        // Simulate throttling
        if (loginAttempts > 2) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Mock login logic
        if (data.username === 'fail') {
            setLoginAttempts(prev => prev + 1);
            setIsLoading(false);
            return;
        }

        // Simulate MFA requirement for some users
        if (!showOTP && data.username === 'mfa') {
            setShowOTP(true);
            setIsLoading(false);
            return;
        }

        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-dte-blue">
                            {t('auth.loginTitle')}
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex items-center justify-end space-x-2 mb-4">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t('auth.institutionLogin')}
                                </label>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={isInstitution}
                                    onChange={(e) => setIsInstitution(e.target.checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('auth.username')}</label>
                                <Input
                                    {...register('username', { required: true })}
                                    placeholder="regNo / email"
                                    disabled={isLoading}
                                />
                                {errors.username && <span className="text-xs text-red-500">Required</span>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">{t('auth.password')}</label>
                                    <a href="#" className="text-xs text-dte-blue hover:underline">{t('auth.forgotPassword')}</a>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', { required: true })}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && <span className="text-xs text-red-500">Required</span>}
                            </div>

                            {showOTP && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-medium">One Time Password</label>
                                    <Input
                                        {...register('otp')}
                                        placeholder="Enter 6-digit OTP"
                                        className="text-center tracking-widest"
                                    />
                                    <p className="text-xs text-muted-foreground">OTP sent to your registered mobile ending in ****89</p>
                                </div>
                            )}

                            {loginAttempts > 2 && (
                                <div className="rounded-md bg-yellow-50 p-3">
                                    <div className="flex">
                                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Too many attempts</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>Please wait a few seconds before trying again.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button className="w-full bg-dte-blue hover:bg-dte-blue/90" type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('auth.loginBtn')}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4" type="button">
                            Login with Gov SSO
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
