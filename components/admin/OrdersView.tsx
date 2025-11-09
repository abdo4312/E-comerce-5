import React, { useState } from 'react';
import { Order, Product } from '../../types';
import OrderDetailModal from './OrderDetailModal';

interface OrdersViewProps {
    orders: Order[];
    products: Product[];
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
    onDeleteOrder: (orderId: string) => void;
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
};

const OrdersView: React.FC<OrdersViewProps> = ({ orders, products, onUpdateOrderStatus, onDeleteOrder }) => {
    const [filter, setFilter] = useState<Order['status'] | 'All'>('All');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    
    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);
    
    const handleDelete = (orderId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
            onDeleteOrder(orderId);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">إدارة الطلبات</h1>

            <div className="flex flex-wrap gap-2 border-b pb-2">
                {(['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            filter === status 
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {status === 'All' ? 'الكل' : (status === 'Processing' ? 'قيد التجهيز' : (status === 'Shipped' ? 'تم الشحن' : (status === 'Delivered' ? 'تم التوصيل' : 'ملغي')))}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 min-w-[768px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">رقم الطلب</th>
                                <th scope="col" className="px-6 py-3">العميل</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3">الإجمالي</th>
                                <th scope="col" className="px-6 py-3 text-center">الحالة</th>
                                <th scope="col" className="px-6 py-3 text-center">تغيير الحالة</th>
                                <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="px-6 py-4 font-bold whitespace-nowrap">{order.total.toFixed(2)} جنيه</td>
                                    <td className="px-6 py-4 text-center"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-center">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        >
                                            <option value="Processing">قيد التجهيز</option>
                                            <option value="Shipped">تم الشحن</option>
                                            <option value="Delivered">تم التوصيل</option>
                                            <option value="Cancelled">ملغي</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="font-medium text-blue-600 hover:underline ml-4"
                                        >
                                            عرض
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(order.id)}
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        لا توجد طلبات تطابق هذا الفلتر.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    products={products}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default OrdersView;