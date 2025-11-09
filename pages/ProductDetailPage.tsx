
import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, Review } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { Page } from '../types';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import RelatedProducts from '../components/RelatedProducts';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  setToastMessage: (message: string) => void;
  categories: Category[];
  allProducts: Product[];
  wishlistItems: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddReview: (reviewData: Omit<Review, 'id' | 'created_at'>) => Promise<void>;
}

// ... (Icons remain the same) ...
const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = 'w-5 h-5' }) => (
  <svg className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
    <svg className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);
const TagIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.707 9.293l-5-5a1 1 0 00-1.414 0L3.586 11.586a1 1 0 000 1.414l5 5a1 1 0 001.414 0l7.707-7.707a1 1 0 000-1.414z"></path></svg>;
const RulerIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16M8 4v16m8-16v16"></path></svg>;
const WeightIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17.172a4 4 0 01-5.656-5.656 4 4 0 015.656 5.656zM12 12h.01M16 6.828a4 4 0 015.656 5.656 4 4 0 01-5.656-5.656zM12 21a9 9 0 110-18 9 9 0 010 18z"></path></svg>;
const MaterialIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l4 4-4 4-4-4 4-4zM1 11l4 4-4 4-4-4 4-4zm15 0l4 4-4 4-4-4 4-4z"></path></svg>;


const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onNavigate, onProductSelect, onAddToCart, setToastMessage, categories, allProducts, wishlistItems, onToggleWishlist, onQuickView, onAddReview }) => {
    const { user } = useAuth();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    const [isZooming, setIsZooming] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);


    const isInWishlist = wishlistItems.includes(product.id);
    
    const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', product.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setReviews(data as Review[]);
        } catch (error: any) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    useEffect(() => {
        setActiveImageIndex(0);
        setQuantity(1);
        setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
        window.scrollTo(0, 0);
        if (product.id) {
            fetchReviews();
        }
    }, [product]);

    const handleToggleWishlistClick = () => { onToggleWishlist(product.id); };
    const handleQuantityChange = (amount: number) => { setQuantity(prev => Math.max(1, Math.min(product.stock, prev + amount))); };
    const handleAddToCartClick = () => {
        onAddToCart(product, quantity);
    }
    
    const handleMouseEnter = () => { if (window.innerWidth >= 1024) setIsZooming(true); };
    const handleMouseLeave = () => { setIsZooming(false); };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (imageContainerRef.current) {
            const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
            setMousePosition({ x: Math.max(0, Math.min(e.clientX - left, width)), y: Math.max(0, Math.min(e.clientY - top, height)) });
        }
    };
    
    const handleAddReview = async ({ rating, reviewText }: { rating: number, reviewText: string }) => {
        if (!user) return;
        setIsSubmittingReview(true);
        await onAddReview({
            product_id: product.id,
            user_id: user.id,
            user_name: user.user_metadata.full_name || 'مستخدم',
            user_avatar_url: user.user_metadata.avatar_url,
            rating,
            review_text: reviewText
        });
        await fetchReviews(); // Refetch reviews to show the new one
        setIsSubmittingReview(false);
    };

    const mainCategory = categories.find(c => c.id === product.subCategory.mainCategoryId);

    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        ...(mainCategory ? [{ name: mainCategory.nameAr, onClick: () => onNavigate('products') }] : []),
        { name: product.subCategory.nameAr },
        { name: product.nameAr }
    ];
    
    const renderStars = (className?: string) => [...Array(5)].map((_, i) => <StarIcon key={i} filled={i < product.ratings.average} className={className} />);
    
    const specifications = [
      { icon: <TagIcon />, label: 'العلامة التجارية', value: 'ماركة شهيرة' },
      ...(product.dimensions ? [{ icon: <RulerIcon />, label: 'الأبعاد', value: product.dimensions }] : []),
      ...(product.weight ? [{ icon: <WeightIcon />, label: 'الوزن', value: `${product.weight} كجم` }] : []),
      ...(product.material ? [{ icon: <MaterialIcon />, label: 'المادة', value: product.material }] : [])
    ];

    const activeImage = product.images?.[activeImageIndex] || product.images?.[0];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image Section */}
                        <div className="lg:sticky lg:top-28">
                           <div ref={imageContainerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} className="relative">
                               {activeImage && (
                                    <div className="relative cursor-crosshair overflow-hidden rounded-lg shadow-lg">
                                        <img src={activeImage.url} alt={activeImage.alt} className="w-full h-auto object-cover aspect-square" />
                                    </div>
                               )}
                               <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                   {product.originalPrice && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">خصم</span>}
                                   {product.isNew && <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">جديد</span>}
                               </div>
                               {isZooming && activeImage && (
                                    <div className="absolute top-0 right-[105%] w-full h-full bg-white border rounded-lg shadow-xl hidden lg:block pointer-events-none z-20"
                                        style={{ backgroundImage: `url(${activeImage.url})`, backgroundRepeat: 'no-repeat', backgroundSize: '250%', backgroundPositionX: `${(mousePosition.x / (imageContainerRef.current?.offsetWidth || 1)) * 100}%`, backgroundPositionY: `${(mousePosition.y / (imageContainerRef.current?.offsetHeight || 1)) * 100}%` }}
                                    />
                               )}
                           </div>
                           {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 mt-4 justify-center">
                                    {product.images.map((image, index) => (
                                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${ index === activeImageIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:border-orange-300' }`} >
                                            <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                           )}
                        </div>
                        {/* Details Section */}
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-orange-500 mb-2">{mainCategory?.nameAr}</p>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.nameAr}</h1>
                            
                            <div className="flex items-center mb-4">
                                {renderStars()}
                                <span className="text-sm text-gray-600 mr-2">({product.ratings.count} مراجعة)</span>
                            </div>
                            
                            <div className="flex items-baseline mb-6"><p className="text-3xl font-black text-orange-500">{product.price.toFixed(2)} جنيه</p>{product.originalPrice && (<p className="text-lg text-gray-400 line-through mr-3">{product.originalPrice.toFixed(2)} جنيه</p>)}</div>
                            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
                            
                            {product.colors && product.colors.length > 0 && (
                                <div className="my-6 p-6 bg-gray-50 rounded-lg border border-gray-200"><h3 className="text-lg font-bold text-gray-900 mb-4">خيارات التخصيص</h3><div className="space-y-3"><label className="text-md font-semibold text-gray-700">اللون:</label><div className="flex items-center gap-3 flex-wrap">{product.colors.map((color) => (<button key={color} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-2 transition-all duration-200 transform hover:scale-110 ${ selectedColor === color ? 'ring-2 ring-offset-2 ring-orange-500 border-white shadow-md' : 'border-gray-200'}`} style={{ backgroundColor: color }} aria-label={`اختر اللون ${color}`} title={color}>{color.toLowerCase() === '#ffffff' && selectedColor !== color && <span className="block w-full h-full rounded-full border border-gray-300"></span>}</button>))}</div></div></div>
                            )}

                            {product.stock > 0 ? (
                                <><div className="flex items-center space-x-4 my-6"><div className="flex items-center border border-gray-300 rounded-md"><button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">-</button><input type="number" value={quantity} readOnly className="w-16 text-center border-0 focus:ring-0"/><button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">+</button></div><button onClick={handleAddToCartClick} className="flex-grow bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-300">أضف إلى السلة</button><button onClick={handleToggleWishlistClick} className={`flex flex-shrink-0 items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 border rounded-lg transition-colors font-bold ${isInWishlist ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'}`} aria-label={isInWishlist ? 'إزالة من قائمة الأمنيات' : 'إضافة إلى قائمة الأمنيات'}><HeartIcon filled={isInWishlist} /><span>{isInWishlist ? 'في قائمة الأمنيات' : 'أضف للأمنيات'}</span></button></div><div className="flex items-center space-x-2 text-sm text-gray-500"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg><span>متوفر في المخزون ({product.stock} قطعة)</span></div></>
                            ) : (
                                <div className="mt-6 p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center"><p className="font-bold text-red-600 text-lg">نفذت الكمية حاليًا</p><p className="text-red-500">هذا المنتج غير متوفر في المخزون.</p></div>
                            )}

                            <div className="mt-10 pt-8 border-t border-gray-200"><h2 className="text-2xl font-bold text-gray-900 mb-4">المواصفات</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{specifications.map((spec, index) => (<div key={index} className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3 rtl:space-x-reverse"><div className="flex-shrink-0 text-orange-500 mt-1">{spec.icon}</div><div><p className="text-sm font-semibold text-gray-500">{spec.label}</p><p className="text-md font-bold text-gray-800">{spec.value}</p></div></div>))}</div></div>

                            {/* Dynamic Reviews Section */}
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">مراجعات العملاء ({product.ratings.count})</h2>
                                {isLoadingReviews ? <p>جاري تحميل المراجعات...</p> : 
                                    reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {reviews.map(review => (
                                                <div key={review.id} className="flex space-x-4 rtl:space-x-reverse">
                                                    <div className="flex-shrink-0">
                                                        <img className="h-12 w-12 rounded-full bg-gray-200" src={review.user_avatar_url || `https://i.pravatar.cc/48?u=${review.user_id}`} alt={review.user_name} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} className='w-4 h-4' />)}</div>
                                                        <p className="mt-1 text-gray-700">{review.review_text}</p>
                                                        <p className="text-sm text-gray-500 mt-2">{review.user_name} - <time dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString('ar-EG')}</time></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">لا توجد مراجعات لهذا المنتج حتى الآن. كن أول من يضيف مراجعة!</p>
                                    )
                                }
                                {user ? (
                                    <ReviewForm onSubmit={handleAddReview} isSubmitting={isSubmittingReview} />
                                ) : (
                                    <div className="mt-8 text-center p-4 bg-gray-100 rounded-lg">
                                        <p>
                                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('auth'); }} className="font-semibold text-orange-500 hover:underline">
                                                سجل الدخول
                                            </a>
                                            &nbsp;لإضافة مراجعتك.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <RelatedProducts 
                currentProduct={product}
                allProducts={allProducts}
                onProductSelect={onProductSelect}
                onAddToCart={onAddToCart}
                setToastMessage={setToastMessage}
                wishlistItems={wishlistItems}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
            />
        </>
    );
};

export default ProductDetailPage;
