import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface AuthPageProps {
  onNavigate: (page: Page) => void;
  onAuthError: (message: string) => void;
}

const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, onAuthError }) => {
    const { user, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            onNavigate('home');
        }
    }, [user, onNavigate]);

    const handleSignIn = async () => {
        setIsLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            onAuthError(`فشل تسجيل الدخول: ${error.message}. يرجى التحقق من إعدادات CORS والمصادقة في Supabase.`);
            setIsLoading(false);
        }
        // On success, the page will redirect, so no need to set isLoading to false.
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك في قرطاسية</h1>
                <p className="text-gray-500 mb-8">سجل الدخول للمتابعة وحفظ طلباتك وقائمة أمنياتك.</p>

                <button
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-wait"
                >
                    {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
                    <span>{isLoading ? 'جاري التحميل...' : 'تسجيل الدخول باستخدام جوجل'}</span>
                </button>
                 <div className="mt-6">
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
                        className="text-sm text-gray-500 hover:text-orange-500 hover:underline"
                    >
                        المتابعة كزائر
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;