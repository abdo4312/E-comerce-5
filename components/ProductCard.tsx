

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductSelect?: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  setToastMessage: (message: string) => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg className="w-6 h-6 transition-colors duration-200" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

// Helper function to generate srcset for responsive images from picsum.photos URLs
const generateSrcSet = (url: string): string | undefined => {
    // This is a mock helper for picsum.photos. In a real app, you'd get different URLs from a CDN.
    if (!url.includes('picsum.photos') || !url.includes('/600/600')) {
        return undefined;
    }
    const baseUrl = url.substring(0, url.lastIndexOf('/600/600'));
    if (!baseUrl) return undefined;
    
    return `${baseUrl}/300/300 300w, ${baseUrl}/600/600 600w, ${baseUrl}/900/900 900w`;
}


const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect, onAddToCart, isInWishlist, onToggleWishlist, onQuickView, setToastMessage }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Using IntersectionObserver to lazy load images.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the card is about to enter the viewport, set isVisible to true.
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after it's visible to avoid re-triggering.
        }
      },
      {
        // Start loading the image 200px before it enters the viewport for a smoother experience.
        rootMargin: '0px 0px 200px 0px',
      }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);


  // Reset loading state when the product prop changes.
  useEffect(() => {
    setIsImageLoading(true);
  }, [product.id]);
  
  const handleToggleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onToggleWishlist(product.id);
    setIsAnimating(true);
    // Reset animation state after it finishes
    setTimeout(() => {
        setIsAnimating(false);
    }, 300);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onAddToCart(product, 1);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} filled={i <= product.ratings.average} />);
    }
    return stars;
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock < 10;
  const imageUrl = product.images[0].url;
  const imageSrcSet = generateSrcSet(imageUrl);

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg shadow-md overflow-hidden group transform transition-all duration-300 ease-in-out flex flex-col ${isOutOfStock ? 'cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'}`}
      onClick={() => !isOutOfStock && onProductSelect?.(product)}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {/* Show placeholder ONLY if the card is visible and its image is loading */}
        {isVisible && isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
            </div>
        )}
        {/* Render the image to start loading only when card is visible */}
        {isVisible && (
            <img 
            src={imageUrl} 
            srcSet={imageSrcSet}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 23vw"
            alt={product.images[0].alt}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)} // Also hide loader on error
            className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'} ${!isOutOfStock ? 'group-hover:scale-105' : 'brightness-50'}`} 
            loading="lazy" // Native lazy loading for browsers that support it as a fallback.
            />
        )}

        {!isOutOfStock ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
              <div className="w-full text-center opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                      }}
                      className="w-full text-gray-900 bg-white font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                      نظرة سريعة
                  </button>
                  <button 
                      onClick={handleAddToCartClick}
                      className="w-full bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-700 hover:shadow-md transition-all duration-300 mt-3">
                      أضف إلى السلة
                  </button>
              </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-md transform -rotate-12">نفذت الكمية</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.originalPrice && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">خصم</span>}
            {product.isNew && <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">جديد</span>}
        </div>
        <button
            onClick={handleToggleWishlistClick}
            className={`absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white/90 hover:scale-110 transition-all duration-200 z-10 ${isAnimating ? 'animate-heart-pop' : ''}`}
            aria-label={isInWishlist ? 'إزالة من قائمة الأمنيات' : 'إضافة إلى قائمة الأمنيات'}
        >
            <HeartIcon filled={isInWishlist} />
        </button>
      </div>
      <div className={`p-4 flex flex-col flex-grow ${isOutOfStock ? 'opacity-60' : ''}`}>
        <p className="text-sm text-gray-500 mb-1">{product.subCategory.nameAr}</p>
        <h3 className="text-lg font-bold text-gray-800 truncate mb-3">{product.nameAr}</h3>
        <div className="flex items-center mb-4">
          {renderStars()}
          <span className="text-xs text-gray-600 mr-2">({product.ratings.count} مراجعة)</span>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-baseline">
                <p className="text-2xl font-black text-orange-500">{product.price.toFixed(2)} جنيه</p>
                {product.originalPrice && (
                    <p className="text-md text-gray-400 line-through mr-2">{product.originalPrice.toFixed(2)} جنيه</p>
                )}
            </div>
            {isLowStock && (
                <p className="text-sm font-semibold text-amber-600 mt-2">
                    باقي {product.stock} قطع فقط!
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;