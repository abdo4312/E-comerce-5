import React, { useState, useEffect } from 'react';
import { Product, Order, PaymentMethod, CartItem } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';

interface CheckoutPageProps {
  products: Product[];
  cartItems: CartItem[];
  onNavigate: (page: Page) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ products, cartItems, onNavigate, onPlaceOrder }) => {
    const { user } = useAuth();
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

    useEffect(() => {
        if(user) {
            setCustomerName(user.user_metadata?.full_name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const getProductDetails = (productId: string) => {
        return products.find(p => p.id === productId);
    }

    const total = cartItems.reduce((acc, item) => {
        const product = getProductDetails(item.productId);
        return acc + (product ? product.price * item.quantity : 0);
    }, 0);

    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        { name: 'سلة التسوق', onClick: () => onNavigate('cart') },
        { name: 'الدفع' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerName && address && phone) {
            onPlaceOrder({
                userId: user?.id,
                customerName,
                address,
                phone,
                total,
                items: cartItems,
                paymentMethod,
            });
        } else {
            alert('يرجى ملء جميع الحقول المطلوبة.');
        }
    };
    
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                 <h1 className="text-3xl font-bold text-gray-800 mt-6">لا توجد منتجات لإتمام الطلب</h1>
                 <p className="text-gray-500 mt-2">سلة التسوق الخاصة بك فارغة. يرجى إضافة منتجات أولاً.</p>
                 <button 
                    onClick={() => onNavigate('products')}
                    className="mt-8 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block"
                >
                    العودة للتسوق
                </button>
            </div>
        )
    }

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">إتمام الطلب</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="lg:flex lg:space-x-8 items-start">
                            <div className="flex-grow bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">معلومات الاستلام</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                                        <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">العنوان</label>
                                        <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder="سيتم استلام الطلب من المكتبة. أدخل عنوانك هنا لأغراض الفوترة." required />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required />
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t">
                                    <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
                                    <div className="space-y-3">
                                        <label htmlFor="cod" className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500 has-[:checked]:ring-1 has-[:checked]:ring-orange-500">
                                            <input 
                                                type="radio" 
                                                id="cod" 
                                                name="paymentMethod" 
                                                value="cod" 
                                                checked={paymentMethod === 'cod'} 
                                                onChange={() => setPaymentMethod('cod')}
                                                className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-500"
                                            />
                                            <div className="mr-4 flex flex-col">
                                                <span className="font-semibold text-gray-800">الدفع عند الاستلام</span>
                                                <span className="text-sm text-gray-500">ادفع نقدًا عند استلام طلبك من المكتبة.</span>
                                            </div>
                                             <svg className="w-8 h-8 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-96 mt-8 lg:mt-0">
                                <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-28">
                                    <h2 className="text-xl font-bold border-b pb-4 mb-4">طلبك</h2>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {cartItems.map(item => {
                                            const product = getProductDetails(item.productId);
                                            if (!product) return null;
                                            return (
                                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">{product.nameAr} <span className="text-gray-400">&times;{item.quantity}</span></span>
                                                    <span className="font-semibold text-gray-800">{(product.price * item.quantity).toFixed(2)} جنيه</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                                        <span>الإجمالي</span>
                                        <span>{total.toFixed(2)} جنيه</span>
                                    </div>
                                    <div className="mt-4 p-3 bg-orange-50 border border-dashed border-orange-200 rounded-lg text-center">
                                        <p className="text-sm text-orange-800 font-semibold">
                                            سيتم الدفع والاستلام في المكتبة
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-300"
                                    >
                                        تأكيد الطلب
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;