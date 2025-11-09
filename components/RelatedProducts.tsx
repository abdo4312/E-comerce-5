import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
    currentProduct: Product;
    allProducts: Product[];
    onProductSelect: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
    setToastMessage: (message: string) => void;
    wishlistItems: string[];
    onToggleWishlist: (productId: string) => void;
    onQuickView: (product: Product) => void;
}

const ChevronLeftIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ChevronRightIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;

const RelatedProducts: React.FC<RelatedProductsProps> = (props) => {
    const { currentProduct, allProducts, onProductSelect, onAddToCart, setToastMessage, wishlistItems, onToggleWishlist, onQuickView } = props;
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showCarouselButtons, setShowCarouselButtons] = useState(false);

    const relatedProducts = useMemo(() => {
        if (!currentProduct || !currentProduct.subCategory) return [];
        // Find products in the same main category, but not the current product itself.
        const mainCatId = currentProduct.subCategory.mainCategoryId;
        return allProducts
            .filter(p => p.subCategory.mainCategoryId === mainCatId && p.id !== currentProduct.id)
            .slice(0, 8); // Limit to 8 related products
    }, [currentProduct, allProducts]);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowCarouselButtons(scrollWidth > clientWidth);
            } else {
                setShowCarouselButtons(false);
            }
        };
        // Use a short timeout to allow the DOM to update before checking overflow.
        const timer = setTimeout(checkOverflow, 100);
        window.addEventListener('resize', checkOverflow);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [relatedProducts]);

    const handleCarouselScroll = (direction: 'next' | 'prev') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            const scrollValue = direction === 'prev' ? scrollAmount : -scrollAmount;
            scrollContainerRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
        }
    };

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-8">منتجات قد تعجبك</h2>
                <div className="relative group">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-8 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                        {relatedProducts.map(related => (
                            <div key={related.id} className="snap-start shrink-0 w-4/5 sm:w-[45%] md:w-[30%] lg:w-[calc(25%-1.5rem)]">
                                <ProductCard 
                                    product={related} 
                                    onProductSelect={onProductSelect} 
                                    onAddToCart={onAddToCart} 
                                    setToastMessage={setToastMessage} 
                                    isInWishlist={wishlistItems.includes(related.id)} 
                                    onToggleWishlist={onToggleWishlist} 
                                    onQuickView={onQuickView} 
                                />
                            </div>
                        ))}
                    </div>
                    {showCarouselButtons && (
                        <>
                            <button onClick={() => handleCarouselScroll('prev')} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-5 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100" aria-label="المنتج السابق"><ChevronRightIcon /></button>
                            <button onClick={() => handleCarouselScroll('next')} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-5 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100" aria-label="المنتج التالي"><ChevronLeftIcon /></button>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RelatedProducts;
