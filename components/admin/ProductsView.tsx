import React, { useState, useMemo } from 'react';
import { Product, Category, SubCategory } from '../../types';
import ProductFormModal from './ProductFormModal';

interface ProductsViewProps {
    products: Product[];
    categories: Category[];
    subCategories: SubCategory[];
    onAddProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
}

const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const ProductsView: React.FC<ProductsViewProps> = ({ products, categories, subCategories, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
            onDeleteProduct(productId);
        }
    };
    
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.nameAr.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.subCategory.mainCategoryId === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">إدارة المنتجات</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon />
                    <span>إضافة منتج جديد</span>
                </button>
            </div>
            
            {/* Search and Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="ابحث عن منتج بالاسم..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="all">كل الفئات</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                    ))}
                </select>
            </div>


            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 min-w-[768px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">المنتج</th>
                                <th scope="col" className="px-6 py-3">الفئة الفرعية</th>
                                <th scope="col" className="px-6 py-3">السعر</th>
                                <th scope="col" className="px-6 py-3">المخزون</th>
                                <th scope="col" className="px-6 py-3 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <img src={product.images[0].url} alt={product.nameAr} className="w-10 h-10 rounded-md object-cover"/>
                                            <span>{product.nameAr}</span>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{product.subCategory.nameAr}</td>
                                    <td className="px-6 py-4 font-semibold">{product.price.toFixed(2)} جنيه</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} قطع
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 rtl:space-x-reverse whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(product)} className="font-medium text-blue-600 hover:underline">تعديل</button>
                                        <button onClick={() => handleDelete(product.id)} className="font-medium text-red-600 hover:underline">حذف</button>
                                    </td>
                                </tr>
                            ))}
                             {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        لا توجد منتجات تطابق البحث.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <ProductFormModal 
                    product={editingProduct} 
                    onClose={handleCloseModal}
                    onAddProduct={onAddProduct}
                    onUpdateProduct={onUpdateProduct}
                    categories={categories}
                    subCategories={subCategories}
                />
            )}
        </div>
    );
};

export default ProductsView;