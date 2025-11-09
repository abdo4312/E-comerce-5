import React, { useMemo } from 'react';
import { Product, Order, Category } from '../../types';
import StatCard from './StatCard';
import SalesChart from './charts/SalesChart';

// --- Icons ---
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

interface DashboardViewProps {
    products: Product[];
    orders: Order[];
    categories: Category[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ products, orders, categories }) => {

    const totalRevenue = useMemo(() => {
        return orders
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);
    }, [orders]);

    const salesLast7Days = useMemo(() => {
        const salesData: { [key: string]: number } = {};
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('ar-EG', { weekday: 'short' });
            salesData[key] = 0;
            days.push({ key, dayName });
        }

        orders.forEach(order => {
            if (order.status === 'Delivered') {
                const orderDate = new Date(order.date).toISOString().split('T')[0];
                if (salesData.hasOwnProperty(orderDate)) {
                    salesData[orderDate] += order.total;
                }
            }
        });

        return days.map(day => ({ day: day.dayName, sales: salesData[day.key] }));
    }, [orders]);
    
    const bestSellingProducts = useMemo(() => {
        const productSales = new Map<string, number>();
        orders.forEach(order => {
            if (order.status === 'Delivered') {
                order.items.forEach(item => {
                    const currentQty = productSales.get(item.productId) || 0;
                    productSales.set(item.productId, currentQty + item.quantity);
                });
            }
        });

        return Array.from(productSales.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === productId);
                return { product, quantity };
            }).filter(item => item.product); // Filter out any cases where product might not be found
    }, [orders, products]);

    const lowStockProducts = useMemo(() => {
        return products
            .filter(p => p.stock > 0 && p.stock < 10)
            .sort((a, b) => a.stock - b.stock);
    }, [products]);


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">لوحة المعلومات</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي المنتجات" value={products.length} icon={<CubeIcon />} color="blue" />
                <StatCard title="إجمالي الفئات" value={categories.length} icon={<CollectionIcon />} color="indigo" />
                <StatCard title="الطلبات المكتملة" value={orders.filter(o => o.status === 'Delivered').length} icon={<ShoppingBagIcon />} color="amber" />
                <StatCard title="إجمالي الأرباح" value={`${totalRevenue.toFixed(2)} جنيه`} icon={<CashIcon />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">المبيعات في آخر 7 أيام</h2>
                    <SalesChart data={salesLast7Days} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">الأكثر مبيعًا</h2>
                    <ul className="space-y-4">
                        {bestSellingProducts.map(({ product, quantity }) => product && (
                            <li key={product.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                                <img src={product.images[0].url} alt={product.nameAr} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-700 truncate">{product.nameAr}</p>
                                    <p className="text-sm text-gray-500">{quantity} قطعة مباعة</p>
                                </div>
                            </li>
                        ))}
                         {bestSellingProducts.length === 0 && (
                            <p className="text-center text-gray-400 pt-8">لا توجد بيانات مبيعات كافية.</p>
                        )}
                    </ul>
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">تنبيهات انخفاض المخزون</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 min-w-[640px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">المنتج</th>
                                <th scope="col" className="px-6 py-3">الفئة</th>
                                <th scope="col" className="px-6 py-3 text-center">الكمية المتبقية</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product.nameAr}
                                    </th>
                                    <td className="px-6 py-4">{product.subCategory.nameAr}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-red-100 text-red-800 text-xs font-bold mr-2 px-3 py-1 rounded-full">
                                            {product.stock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                             {lowStockProducts.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">
                                        لا توجد منتجات منخفضة المخزون حاليًا.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;