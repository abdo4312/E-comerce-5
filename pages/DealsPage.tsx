// FIX: Implement the DealsPage component to display products with discounts.
import React, { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { Page, Product, SiteContent } from '../types';

interface DealsPageProps {
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  setToastMessage: (message: string) => void;
  wishlistItems: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  products: Product[];
  siteContent: SiteContent['dealsPage'];
}

const BestDealBanner: React.FC<{ product: Product; onProductSelect: (product: Product) => void; }> = ({ product, onProductSelect }) => {
    const discountPercentage = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="relative bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-xl p-8 mb-16 overflow-hidden flex flex-col md:flex-row items-center">
            {/* Decorative shapes */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-white opacity-10 rounded-full"></div>

            <div className="md:w-1/2 text-white text-center md:text-right mb-6 md:mb-0 z-10">
                <span className="bg-white text-red-500 font-bold px-4 py-1 rounded-full text-sm">أفضل عرض!</span>
                <h2 className="text-4xl lg:text-5xl font-black mt-4 mb-4">{product.nameAr}</h2>
                
                <div className="relative inline-block my-4">
                    <div className="absolute -inset-1.5 bg-yellow-300 rounded-full blur-lg opacity-75 animate-pulse"></div>
                    <div className="relative bg-yellow-400 text-red-600 font-black px-6 py-2 rounded-full text-2xl">
                        خصم {discountPercentage}%
                    </div>
                </div>

                <div className="flex items-center justify-center md:justify-start space-x-4 mt-6 mb-6">
                    <p className="text-4xl font-black">{product.price.toFixed(2)} جنيه</p>
                    <p className="text-2xl text-yellow-200 line-through opacity-80">{product.originalPrice?.toFixed(2)} جنيه</p>
                </div>
                <button onClick={() => onProductSelect(product)} className="bg-white text-orange-500 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 inline-block animate-pulse">
                    تسوق الآن
                </button>
            </div>
            <div className="md:w-1/2 flex justify-center z-10">
                <img src={product.images[0].url} alt={product.images[0].alt} className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl transform transition-transform duration-500 hover:scale-110" />
            </div>
        </div>
    );
}


const DealsPage: React.FC<DealsPageProps> = ({ onNavigate, onProductSelect, onAddToCart, setToastMessage, wishlistItems, onToggleWishlist, onQuickView, products, siteContent }) => {
  const dealProducts = products.filter(p => p.originalPrice);

  const bestDeal = useMemo(() => {
    if (siteContent.bestDealProductId) {
        const pinnedProduct = products.find(p => p.id === siteContent.bestDealProductId);
        // Ensure the pinned product is actually on deal
        if (pinnedProduct && pinnedProduct.originalPrice) {
            return pinnedProduct;
        }
    }
    
    if (dealProducts.length === 0) return null;

    return dealProducts.reduce((best, current) => {
      if (!current.originalPrice) return best;
      const bestDiscount = best.originalPrice ? (best.originalPrice - best.price) / best.originalPrice : 0;
      const currentDiscount = (current.originalPrice - current.price) / current.originalPrice;
      return currentDiscount > bestDiscount ? current : best;
    }, dealProducts[0]);
  }, [siteContent.bestDealProductId, products, dealProducts]);


  const breadcrumbItems = [
    { name: 'الرئيسية', onClick: () => onNavigate('home') },
    { name: 'العروض' }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent pb-2 [text-shadow:2px_2px_4px_rgba(0,0,0,0.1)]">عروض خاصة</h1>
            <p className="text-lg text-gray-600 mt-2">لا تفوت خصوماتنا المذهلة على أفضل المنتجات!</p>
        </div>

        {bestDeal && <BestDealBanner product={bestDeal} onProductSelect={onProductSelect} />}
        
        <h2 className="text-3xl font-bold text-center mb-8">كل العروض</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dealProducts.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onProductSelect={onProductSelect} 
                onAddToCart={onAddToCart}
                setToastMessage={setToastMessage}
                isInWishlist={wishlistItems.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
            />
          ))}
        </div>
        {dealProducts.length === 0 && (
            <p className="text-center text-gray-500 text-xl mt-8">لا توجد عروض متاحة حاليًا. تفقدنا لاحقًا!</p>
        )}
      </div>
    </>
  );
};

export default DealsPage;