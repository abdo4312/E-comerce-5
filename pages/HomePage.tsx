import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, Category, Page, SiteContent, HomePageSection, HeroSection, CategoryGridSection, ProductCarouselSection, PromoBannerSection } from '../types';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  setToastMessage: (message: string) => void;
  onSelectCategory: (categoryId: string | null) => void;
  wishlistItems: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (page: Page) => void;
  siteContent: SiteContent['homepage'];
}

// --- Icons ---
const ChevronLeftIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ChevronRightIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;

// --- Helper Functions ---
const useProductsByFilter = (allProducts: Product[], filter: 'bestseller' | 'new' | 'sale') => {
    switch (filter) {
        case 'bestseller':
            return allProducts.filter(p => p.isBestseller).slice(0, 8);
        case 'new':
            return allProducts.filter(p => p.isNew).slice(0, 8);
        case 'sale':
            return allProducts.filter(p => p.originalPrice).slice(0, 8);
        default:
            return [];
    }
};

// --- Section Components ---

const HeroCarousel: React.FC<{ section: HeroSection; onNavigate: (link: string | Page, type: 'page' | 'category') => void }> = ({ section, onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex === section.banners.length - 1 ? 0 : prevIndex + 1));
        }, 5000); // Change slide every 5 seconds

        return () => {
            resetTimeout();
        };
    }, [currentIndex, section.banners.length]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    const nextSlide = () => {
        setCurrentIndex(currentIndex === section.banners.length - 1 ? 0 : currentIndex + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? section.banners.length - 1 : currentIndex - 1);
    };
    
    if (!section.enabled || section.banners.length === 0) return null;

    const activeBanner = section.banners[currentIndex];
    const layoutClasses = {
        'text-center': 'items-center text-center',
        'text-left': 'items-start text-left rtl:items-end rtl:text-right',
        'text-right': 'items-end text-right rtl:items-start rtl:text-left',
    };

    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] group">
            <div className="w-full h-full relative overflow-hidden">
                {section.banners.map((banner, index) => (
                    <div
                        key={index}
                        className="absolute w-full h-full transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: index === currentIndex ? 1 : 0 }}
                    >
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${banner.image}')` }}></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}
            </div>

            <div className={`absolute inset-0 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center ${layoutClasses[activeBanner.layout]}`}>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                    {activeBanner.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl text-white mb-8 drop-shadow-md">
                    {activeBanner.subtitle}
                </p>
                <button
                    onClick={() => onNavigate(activeBanner.link, activeBanner.linkType)}
                    className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block w-auto shadow-lg"
                >
                    {activeBanner.buttonText}
                </button>
            </div>
            
            {/* Controls */}
            <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon /></button>
            <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon /></button>

            <div className="absolute bottom-5 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {section.banners.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`transition-all w-3 h-3 bg-white rounded-full cursor-pointer ${currentIndex === slideIndex ? "p-2" : "bg-opacity-50"}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CategoryGridDisplay: React.FC<{ section: CategoryGridSection; allCategories: Category[]; onSelectCategory: (categoryId: string) => void }> = ({ section, allCategories, onSelectCategory }) => {
    if (!section.enabled) return null;
    const categoriesToShow = allCategories.filter(c => section.categoryIds.includes(c.id));

    return (
        <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{section.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categoriesToShow.map(category => (
                        <div key={category.id} onClick={() => onSelectCategory(category.id)} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-all duration-300">
                                <img src={category.image} alt={category.nameAr} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <h3 className="text-white text-2xl font-bold text-center p-4">{category.nameAr}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProductCarouselDisplay: React.FC<{ section: ProductCarouselSection; products: Product[]; onNavigate: (page: Page) => void; productCardProps: Omit<HomePageProps, 'products' | 'categories' | 'siteContent' | 'onNavigate' | 'onSelectCategory' > }> = ({ section, products, onNavigate, productCardProps }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'next' | 'prev') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            const scrollValue = direction === 'prev' ? scrollAmount : -scrollAmount;
            scrollContainerRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
        }
    };
    
    if (!section.enabled || products.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(section.linkToPage); }} className="text-orange-500 font-semibold hover:underline">عرض الكل</a>
                </div>
                <div className="relative group">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-8 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                        {products.map(product => (
                            <div key={product.id} className="snap-start shrink-0 w-4/5 sm:w-[45%] md:w-[30%] lg:w-[calc(25%-1.5rem)]">
                                <ProductCard product={product} {...productCardProps} />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleScroll('prev')} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-5 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 disabled:opacity-0 text-gray-800" aria-label="السابق"><ChevronRightIcon /></button>
                    <button onClick={() => handleScroll('next')} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-5 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 disabled:opacity-0 text-gray-800" aria-label="التالي"><ChevronLeftIcon /></button>
                </div>
            </div>
        </section>
    );
};

const StackedCardCarousel: React.FC<{ section: ProductCarouselSection; products: Product[]; onNavigate: (page: Page) => void; productCardProps: Omit<HomePageProps, 'products' | 'categories' | 'siteContent' | 'onNavigate' | 'onSelectCategory' > }> = ({ section, products, onNavigate, productCardProps }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    if (!section.enabled || products.length === 0) return null;

    const handleNext = () => setActiveIndex(prev => (prev + 1) % products.length);
    const handlePrev = () => setActiveIndex(prev => (prev - 1 + products.length) % products.length);

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(section.linkToPage); }} className="text-orange-500 font-semibold hover:underline">عرض الكل</a>
                </div>
                <div className="relative h-[500px] flex items-center justify-center">
                    {products.map((product, index) => {
                        const offset = (index - activeIndex + products.length) % products.length;
                        const isVisible = offset < 4; // Only render the first few cards for performance

                        if (!isVisible) return null;
                        
                        const scale = 1 - offset * 0.05;
                        const translateY = offset * 20;
                        const zIndex = products.length - offset;
                        const opacity = offset === 3 ? 0 : 1;
                        
                        return (
                            <div
                                key={product.id}
                                className="absolute transition-all duration-500 ease-out w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%]"
                                style={{
                                    transform: `translateY(${translateY}px) scale(${scale})`,
                                    zIndex,
                                    opacity,
                                    pointerEvents: offset === 0 ? 'auto' : 'none',
                                }}
                            >
                                <ProductCard product={product} {...productCardProps} />
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center items-center gap-6 mt-8">
                    <button onClick={handlePrev} className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all text-gray-800" aria-label="السابق"><ChevronRightIcon /></button>
                    <button onClick={handleNext} className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all text-gray-800" aria-label="التالي"><ChevronLeftIcon /></button>
                </div>
            </div>
        </section>
    );
};


const PromoBannerDisplay: React.FC<{ section: PromoBannerSection; onNavigate: (link: string | Page, type: 'page' | 'category') => void }> = ({ section, onNavigate }) => {
    const { bannerType, content: banner } = section;
    
    if (!banner.enabled) return null;
    
    const isTextLeft = banner.layout === 'text-left';

    if (bannerType === 'split') {
        return (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className={`flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden min-h-[350px] ${isTextLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-right">
                        <h2 className="text-4xl font-black text-gray-800 mb-3">{banner.title}</h2>
                        <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto md:mx-0">{banner.subtitle}</p>
                        <div className="mt-auto pt-4">
                            <button onClick={() => onNavigate(banner.link, banner.linkType)} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 inline-block">
                                {banner.buttonText}
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-cover bg-center min-h-[250px] md:min-h-0" style={{ backgroundImage: `url('${banner.image}')` }}></div>
                </div>
            </section>
        );
    }

    // Default to 'full' banner
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="relative bg-cover bg-center rounded-2xl shadow-xl overflow-hidden text-white p-12 min-h-[300px] flex flex-col items-center justify-center text-center" style={{ backgroundImage: `url('${banner.image}')` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/70 to-blue-500/70"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-3">{banner.title}</h2>
                    <p className="text-lg mb-6 max-w-xl">{banner.subtitle}</p>
                    <button onClick={() => onNavigate(banner.link, banner.linkType)} className="bg-white text-orange-500 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 inline-block">
                        {banner.buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
};

// --- Main Component ---
const HomePage: React.FC<HomePageProps> = (props) => {
    const { products, categories, onSelectCategory, onNavigate, siteContent } = props;
    const { sections } = siteContent;

    const handleNavigation = (link: string | Page, type: 'page' | 'category') => {
        if (type === 'page') {
            onNavigate(link as Page);
        } else {
            onSelectCategory(link);
        }
    };
    
    const productCardProps = {
        onProductSelect: props.onProductSelect,
        onAddToCart: props.onAddToCart,
        setToastMessage: props.setToastMessage,
        wishlistItems: props.wishlistItems,
        onToggleWishlist: props.onToggleWishlist,
        onQuickView: props.onQuickView
    };

    const renderSection = (section: HomePageSection, index: number) => {
        switch (section.type) {
            case 'hero':
                return <HeroCarousel key={index} section={section} onNavigate={handleNavigation} />;
            case 'categoryGrid':
                return <CategoryGridDisplay key={index} section={section} allCategories={categories} onSelectCategory={onSelectCategory} />;
            case 'productCarousel':
                const carouselProducts = useProductsByFilter(products, section.filter);
                if (section.layout === 'stacked-card') {
                    return <StackedCardCarousel key={index} section={section} products={carouselProducts} onNavigate={onNavigate} productCardProps={productCardProps} />;
                }
                return <ProductCarouselDisplay key={index} section={section} products={carouselProducts} onNavigate={onNavigate} productCardProps={productCardProps} />;
            case 'promoBanner':
                return <PromoBannerDisplay key={index} section={section} onNavigate={handleNavigation} />;
            default:
                return null;
        }
    };

    return (
        <>
            {sections.map(renderSection)}
        </>
    );
};

export default HomePage;