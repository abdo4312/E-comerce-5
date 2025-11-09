import React, { useState } from 'react';
import { Order, Product } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface OrdersHistoryPageProps {
  orders: Order[];
  products: Product[];
  onNavigate: (page: Page) => void;
  onRequestOrderCancellation: (orderId: string) => void;
}

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusMap = {
        Processing: { text: 'قيد التجهيز', color: 'bg-yellow-100 text-yellow-800' },
        Shipped: { text: 'تم الشحن', color: 'bg-blue-100 text-blue-800' },
        Delivered: { text: 'تم التوصيل', color: 'bg-green-100 text-green-800' },
        Cancelled: { text: 'ملغي', color: 'bg-red-100 text-red-800' },
    };
    const { text, color } = statusMap[status] || statusMap.Processing;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>;
}

const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({ orders, products, onNavigate, onRequestOrderCancellation }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const getProductDetails = (productId: string) => products.find(p => p.id === productId);

    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        { name: 'سجل الطلبات' }
    ];

    if (orders.length === 0) {
        return (
            <>
                <Breadcrumbs items={breadcrumbItems} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">لا توجد طلبات سابقة</h1>
                    <p className="text-gray-500 mt-2">لم تقم بأي عمليات شراء بعد. ابدأ التسوق الآن!</p>
                     <button 
                        onClick={() => onNavigate('products')}
                        className="mt-8 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block"
                    >
                        تصفح المنتجات
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">سجل الطلبات</h1>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">رقم الطلب</th>
                                    <th scope="col" className="px-6 py-3">التاريخ</th>
                                    <th scope="col" className="px-6 py-3">الحالة</th>
                                    <th scope="col" className="px-6 py-3">الإجمالي</th>
                                    <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                            <td className="px-6 py-4 font-bold">{order.total.toFixed(2)} جنيه</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                                                    <button
                                                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                        className="text-orange-500 hover:underline font-semibold"
                                                    >
                                                        {expandedOrderId === order.id ? 'إخفاء' : 'التفاصيل'}
                                                    </button>
                                                    {order.status === 'Processing' && (
                                                        <>
                                                            <span className="text-gray-300">|</span>
                                                            <button
                                                                onClick={() => onRequestOrderCancellation(order.id)}
                                                                className="text-red-500 hover:underline font-semibold"
                                                            >
                                                                إلغاء الطلب
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedOrderId === order.id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={5} className="p-4">
                                                    <div className="p-4 bg-white rounded-md border">
                                                        <h4 className="font-bold mb-2">محتويات الطلب:</h4>
                                                        <ul className="space-y-2">
                                                            {order.items.map(item => {
                                                                const product = getProductDetails(item.productId);
                                                                return (
                                                                    <li key={item.productId} className="flex items-center space-x-3 rtl:space-x-reverse">
                                                                        <img src={product?.images[0].url} alt={product?.nameAr} className="w-12 h-12 rounded object-cover" />
                                                                        <div>
                                                                            <p className="font-semibold text-gray-800">{product?.nameAr}</p>
                                                                            <p className="text-xs text-gray-500">الكمية: {item.quantity} | السعر: {product?.price.toFixed(2)}</p>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrdersHistoryPage;