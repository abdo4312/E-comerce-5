import React from 'react';
import { Order, Product } from '../../types';

interface OrderDetailModalProps {
    order: Order;
    products: Product[];
    onClose: () => void;
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

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, products, onClose }) => {
    const getProductDetails = (productId: string) => products.find(p => p.id === productId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلب #{order.id}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">تاريخ الطلب</p>
                            <p className="font-semibold text-gray-800">{new Date(order.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">الإجمالي</p>
                            <p className="font-semibold text-gray-800">{order.total.toFixed(2)} جنيه</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">الحالة</p>
                            <StatusBadge status={order.status} />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">معلومات العميل</h3>
                        <div className="space-y-1 text-gray-700">
                            <p><strong>الاسم:</strong> {order.customerName}</p>
                            <p><strong>الهاتف:</strong> {order.phone}</p>
                            <p><strong>العنوان:</strong> {order.address}</p>
                        </div>
                    </div>
                    
                    {/* Items */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">المنتجات المطلوبة</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-right text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2">المنتج</th>
                                        <th className="px-4 py-2 text-center">الكمية</th>
                                        <th className="px-4 py-2 text-center">السعر</th>
                                        <th className="px-4 py-2 text-left">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => {
                                        const product = getProductDetails(item.productId);
                                        return (
                                            <tr key={item.productId} className="border-b">
                                                <td className="p-2 flex items-center gap-3">
                                                    {product && <img src={product.images[0].url} alt={product.nameAr} className="w-12 h-12 object-cover rounded" />}
                                                    <span className="font-medium text-gray-800">{product?.nameAr || 'منتج محذوف'}</span>
                                                </td>
                                                <td className="p-2 text-center">{item.quantity}</td>
                                                <td className="p-2 text-center">{product?.price.toFixed(2)}</td>
                                                <td className="p-2 text-left font-semibold">{(product ? product.price * item.quantity : 0).toFixed(2)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;