import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';

interface BestsellersViewProps {
    products: Product[];
    onUpdateProduct: (product: Product) => void;
}

const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const BestsellersView: React.FC<BestsellersViewProps> = ({ products, onUpdateProduct }) => {
    const [productToAdd, setProductToAdd] = useState<string>('');

    const { bestsellerProducts, nonBestsellerProducts } = useMemo(() => {
        const bestsellers: Product[] = [];
        const nonBestsellers: Product[] = [];
        products.forEach(p => {
            if (p.isBestseller) {
                bestsellers.push(p);
            } else {
                nonBestsellers.push(p);
            }
        });
        return { bestsellerProducts: bestsellers, nonBestsellerProducts: nonBestsellers };
    }, [products]);

    // Set initial state for the dropdown
    useEffect(() => {
        if (nonBestsellerProducts.length > 0) {
            setProductToAdd(nonBestsellerProducts[0].id);
        } else {
            setProductToAdd('');
        }
    }, [nonBestsellerProducts]);

    const handleAddBestseller = () => {
        if (!productToAdd) return;
        const product = products.find(p => p.id === productToAdd);
        if (product) {
            onUpdateProduct({ ...product, isBestseller: true });
        }
    };

    const handleRemoveBestseller = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            onUpdateProduct({ ...product, isBestseller: false });
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">إدارة الأكثر مبيعًا</h1>
            
            {/* Add Bestseller Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">إضافة منتج للأكثر مبيعًا</h2>
                {nonBestsellerProducts.length > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-grow">
                             <label htmlFor="product-to-add" className="block text-sm font-medium text-gray-700 mb-1">
                                اختر منتجًا
                             </label>
                             <select
                                id="product-to-add"
                                value={productToAdd}
                                onChange={(e) => setProductToAdd(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {nonBestsellerProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.nameAr}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddBestseller}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon />
                            <span>إضافة</span>
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500">جميع المنتجات مدرجة بالفعل كأكثر مبيعًا.</p>
                )}
            </div>

            {/* Current Bestsellers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 min-w-[640px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">المنتج</th>
                                <th scope="col" className="px-6 py-3">السعر</th>
                                <th scope="col" className="px-6 py-3">المخزون</th>
                                <th scope="col" className="px-6 py-3 text-center">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bestsellerProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <img src={product.images[0].url} alt={product.nameAr} className="w-10 h-10 rounded-md object-cover"/>
                                            <span>{product.nameAr}</span>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 font-semibold">{product.price.toFixed(2)} جنيه</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} قطع
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleRemoveBestseller(product.id)} className="font-medium text-red-600 hover:underline">
                                            إزالة من القائمة
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {bestsellerProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        لا توجد منتجات في قائمة الأكثر مبيعًا حاليًا.
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

export default BestsellersView;
