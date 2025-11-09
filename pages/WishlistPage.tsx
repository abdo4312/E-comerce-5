import React from 'react';
import { Product } from '../types';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  wishlistItems: string[];
  allProducts: Product[];
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  setToastMessage: (message: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistItems,
  allProducts,
  onNavigate,
  onProductSelect,
  onAddToCart,
  setToastMessage,
  onToggleWishlist,
  onQuickView,
}) => {
  const wishlistProducts = allProducts.filter(p => wishlistItems.includes(p.id));

  const breadcrumbItems = [
    { name: 'الرئيسية', onClick: () => onNavigate('home') },
    { name: 'قائمة الأمنيات' }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">قائمة الأمنيات</h1>
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductSelect={onProductSelect}
                onAddToCart={onAddToCart}
                setToastMessage={setToastMessage}
                isInWishlist={true} // It's always in the wishlist on this page
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-700">قائمة أمنياتك فارغة</h2>
            <p className="text-gray-500 mt-2">أضف المنتجات التي تعجبك لشرائها لاحقاً.</p>
            <button
                onClick={() => onNavigate('products')}
                className="mt-8 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block"
            >
                تصفح المنتجات
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;