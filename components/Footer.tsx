import React, { useState } from 'react';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onSubscribe: (message: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      onSubscribe('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      onSubscribe(`تم تسجيل بريدك الإلكتروني ${email} بنجاح!`);
      setEmail('');
    }, 1500); // Simulate network request
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">قرطاسية</h3>
            <p className="text-gray-400">متجرك الأول لجميع الأدوات المكتبية والمدرسية. نوفر لك الجودة والإلهام في مكان واحد.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about');}} className="text-gray-400 hover:text-white transition-colors">عن المتجر</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy');}} className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms');}} className="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin');}} className="text-gray-400 hover:text-white transition-colors">لوحة التحكم</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-gray-400">
              <li>القاهرة, مصر</li>
              <li>هاتف: +20 123 456 7890</li>
              <li>البريد: support@stationery.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">اشترك في نشرتنا البريدية</h3>
            <p className="text-gray-400 mb-4">احصل على آخر العروض والتحديثات مباشرة.</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className="w-full rounded-r-md border-0 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-orange-500 disabled:bg-gray-200"
                required
              />
              <button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-orange-500 text-white px-4 rounded-l-md hover:bg-orange-600 transition-colors flex items-center justify-center w-24 disabled:bg-orange-300 disabled:cursor-wait"
              >
                {isSubscribing ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'اشتراك'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} متجر قرطاسية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;