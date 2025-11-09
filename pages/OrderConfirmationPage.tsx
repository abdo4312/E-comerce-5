import React from 'react';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface OrderConfirmationPageProps {
  orderId: string | null;
  onNavigate: (page: Page) => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-6">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-black text-gray-800 mt-6">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-600 mt-2 max-w-lg">
            شكرًا لك على التسوق معنا. طلبك قيد التجهيز الآن وسنخبرك عندما يكون جاهزًا للاستلام من المكتبة.
        </p>

        {orderId && (
            <div className="mt-8 bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-gray-600">رقم طلبك هو:</p>
                <p className="text-2xl font-bold text-orange-500 tracking-widest">{orderId}</p>
            </div>
        )}

        <button 
            onClick={() => onNavigate('home')}
            className="mt-10 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block"
        >
            العودة إلى الصفحة الرئيسية
        </button>
    </div>
  );
};

export default OrderConfirmationPage;