import React, { useState } from 'react';
import { Product, Category } from '../types';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  categories: Category[];
  setToastMessage: (message: string) => void;
  onNavigateToProduct: () => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart, categories, setToastMessage, onNavigateToProduct }) => {
    const [quantity, setQuantity] = useState(1);
    
    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const handleAddToCartClick = () => {
        onAddToCart(product, quantity);
        onClose();
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
        stars.push(<StarIcon key={i} filled={i <= product.ratings.average} />);
        }
        return stars;
    };

    const mainCategory = categories.find(c => c.id === product.subCategory.mainCategoryId);
    const isOutOfStock = product.stock === 0;

    return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl m-4 flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 ease-in-out scale-95 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
        
        <div className="w-full md:w-1/2 p-4">
            <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover rounded-lg" />
        </div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <p className="text-sm text-gray-500 mb-2">{mainCategory?.nameAr}</p>
            <h2 id="quick-view-title" className="text-3xl font-bold text-gray-900 mb-3">{product.nameAr}</h2>
            
            <div className="flex items-center mb-4">
                {renderStars()}
                <span className="text-sm text-gray-600 mr-2">({product.ratings.count} مراجعة)</span>
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex items-baseline mb-6">
                <p className="text-3xl font-black text-orange-500">{product.price.toFixed(2)} جنيه</p>
                {product.originalPrice && (
                    <p className="text-lg text-gray-400 line-through mr-3">{product.originalPrice.toFixed(2)} جنيه</p>
                )}
            </div>

             {isOutOfStock ? (
                <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center">
                    <p className="font-bold text-red-600 text-lg">نفذت الكمية حاليًا</p>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">-</button>
                        <input type="number" value={quantity} readOnly className="w-16 text-center border-0 focus:ring-0"/>
                        <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">+</button>
                    </div>
                    <button 
                        onClick={handleAddToCartClick}
                        className="flex-grow bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-300"
                    >
                        أضف إلى السلة
                    </button>
                </div>
            )}
            
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToProduct(); }} className="text-center text-orange-500 hover:underline mt-4">
                عرض التفاصيل الكاملة
            </a>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;