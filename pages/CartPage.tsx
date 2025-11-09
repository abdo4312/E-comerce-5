import React from 'react';
import { Product, CartItem } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { Page } from '../types';

interface CartPageProps {
  products: Product[];
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onNavigate: (page: Page) => void;
  setToastMessage: (message: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ products, cartItems, onUpdateQuantity, onRemoveFromCart, onNavigate, setToastMessage }) => {
  
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  }

  const total = cartItems.reduce((acc, item) => {
    const product = getProductDetails(item.productId);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  const breadcrumbItems = [
    { name: 'الرئيسية', onClick: () => onNavigate('home') },
    { name: 'سلة التسوق' }
  ];

  if (cartItems.length === 0) {
    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h1 className="text-3xl font-bold text-gray-800 mt-6">سلة التسوق فارغة</h1>
                <p className="text-gray-500 mt-2">ليس لديك أي منتجات في سلتك. لنبدأ التسوق!</p>
                <button 
                    onClick={() => onNavigate('products')}
                    className="mt-8 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block"
                >
                    متابعة التسوق
                </button>
            </div>
        </>
    )
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">سلة التسوق</h1>
          <div className="lg:flex lg:space-x-8 items-start">
            <div className="flex-grow bg-white rounded-lg shadow-md p-6">
                <div className="hidden md:grid md:grid-cols-6 gap-4 font-bold text-gray-500 border-b pb-4 mb-4 text-sm uppercase">
                    <div className="col-span-3">المنتج</div>
                    <div className="text-center">السعر</div>
                    <div className="text-center">الكمية</div>
                    <div className="text-right">الإجمالي</div>
                </div>

                {cartItems.map(item => {
                    const product = getProductDetails(item.productId);
                    if (!product) return null;
                    const itemTotal = product.price * item.quantity;
                    const isMaxQuantity = item.quantity >= product.stock;

                    return (
                        <div key={item.productId} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b py-4">
                            <div className="col-span-3 flex items-center space-x-4">
                                <img src={product.images[0].url} alt={product.images[0].alt} className="w-20 h-20 object-cover rounded-md" />
                                <div>
                                    <p className="font-bold text-gray-800">{product.nameAr}</p>
                                    <p className="text-sm text-gray-500">{product.subCategory.nameAr}</p>
                                    <button onClick={() => onRemoveFromCart(item.productId)} className="text-red-500 hover:underline text-sm mt-1">إزالة</button>
                                </div>
                            </div>
                            <div className="text-center text-gray-600">
                                <span className="md:hidden font-semibold">السعر: </span>{product.price.toFixed(2)} جنيه
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">-</button>
                                    <input type="number" value={item.quantity} readOnly className="w-12 text-center border-0 focus:ring-0"/>
                                    <button 
                                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} 
                                        className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isMaxQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                                {isMaxQuantity && <p className="text-xs text-red-500 mt-1">الحد الأقصى للكمية</p>}
                            </div>
                            <div className="text-right font-bold text-gray-800">
                                <span className="md:hidden font-semibold">الإجمالي: </span>{itemTotal.toFixed(2)} جنيه
                            </div>
                        </div>
                    );
                })}

            </div>
            <div className="lg:w-80 mt-8 lg:mt-0">
                <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-28">
                    <h2 className="text-xl font-bold border-b pb-4 mb-4">ملخص الطلب</h2>
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>المجموع الفرعي</span>
                        <span>{total.toFixed(2)} جنيه</span>
                    </div>
                     <div className="flex justify-between mb-4 text-gray-600">
                        <span>الشحن</span>
                        <span className="text-green-500 font-semibold">مجاني</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                        <span>الإجمالي</span>
                        <span>{total.toFixed(2)} جنيه</span>
                    </div>
                    <button 
                        onClick={() => onNavigate('checkout')}
                        className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-300"
                    >
                        المتابعة للدفع
                    </button>
                     <button 
                        onClick={() => onNavigate('products')}
                        className="w-full mt-3 bg-white border border-orange-500 text-orange-500 font-bold py-3 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        متابعة التسوق
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;