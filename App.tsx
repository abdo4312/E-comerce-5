
import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { products as mockProducts, categories as mockCategories, subCategories as mockSubCategories } from './data/mockData';
import { Product, Category, SubCategory, Page, Order, Review, SiteContent, HomePageSection, ChatConversation, ChatMessage } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DealsPage from './pages/DealsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/AdminPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AboutUsPage from './pages/AboutUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import Toast from './components/Toast';
import QuickViewModal from './components/QuickViewModal';
import { supabase } from './supabaseClient';
import useCartStore from './stores/cartStore';
import SplashScreen from './components/SplashScreen';
import ProgressBar from './components/ProgressBar';
import ChatWidget from './components/chat/ChatWidget';


const GUEST_WISHLIST_KEY = 'stationery_guest_wishlist';

// Mock Site Content with stable IDs
const mockSiteContent: SiteContent = {
    homepage: {
        sections: [
            { id: 'hps-1', type: 'hero', enabled: true, banners: [
                { enabled: true, image: 'https://picsum.photos/seed/hero1/1920/1080', title: 'عودة المدارس', subtitle: 'استعد للعام الدراسي الجديد مع أفضل تشكيلة من الأدوات المدرسية.', buttonText: 'تسوق الآن', link: 'products', linkType: 'page', layout: 'text-center' },
                { enabled: true, image: 'https://picsum.photos/seed/hero2/1920/1080', title: 'عروض خاصة', subtitle: 'خصومات تصل إلى 30% على منتجات مختارة.', buttonText: 'اكتشف العروض', link: 'deals', linkType: 'page', layout: 'text-left' }
            ]},
            { id: 'hps-2', type: 'categoryGrid', enabled: true, title: 'تسوق حسب الفئة', categoryIds: ['1', '2', '3', '4'] },
            { id: 'hps-3', type: 'productCarousel', enabled: true, title: 'الأكثر مبيعًا', filter: 'bestseller', layout: 'default', linkToPage: 'products' },
            { id: 'hps-4', type: 'promoBanner', enabled: true, bannerType: 'split', content: { enabled: true, image: 'https://picsum.photos/seed/promo1/800/600', title: 'لوازم الفنانين', subtitle: 'أطلق العنان لإبداعك مع مجموعة واسعة من أدوات الرسم.', buttonText: 'استكشف الآن', link: '4', linkType: 'category', layout: 'text-right' } },
            { id: 'hps-5', type: 'productCarousel', enabled: true, title: 'وصل حديثًا', filter: 'new', layout: 'stacked-card', linkToPage: 'products' },
        ] as HomePageSection[]
    },
    dealsPage: {
        bestDealProductId: 'p4',
    }
};

function AppContent() {
    const { user } = useAuth();
    const [page, setPage] = useState<Page>('home');
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);

    // Data states
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent>(mockSiteContent);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // UI states
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    
    // Zustand stores
    const { items: cartItems, actions: cartActions } = useCartStore();

    // Wishlist state (local)
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);

    // --- Effects for data loading and syncing ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                // Assuming Supabase table names are camelCase to match existing code
                const productsPromise = supabase.from('products').select('*, subCategory:sub_categories(*)');
                const categoriesPromise = supabase.from('categories').select('*');
                const subCategoriesPromise = supabase.from('sub_categories').select('*');
                const reviewsPromise = supabase.from('reviews').select('*');
                const siteContentPromise = supabase.from('site_content').select('*').limit(1).single();
                const ordersPromise = supabase.from('orders').select('*').order('date', { ascending: false });

                const [
                    { data: productsData, error: productsError },
                    { data: categoriesData, error: categoriesError },
                    { data: subCategoriesData, error: subCategoriesError },
                    { data: reviewsData, error: reviewsError },
                    { data: siteContentData, error: siteContentError },
                    { data: ordersData, error: ordersError },
                ] = await Promise.all([productsPromise, categoriesPromise, subCategoriesPromise, reviewsPromise, siteContentPromise, ordersPromise]);

                if (productsError) throw productsError;
                if (categoriesError) throw categoriesError;
                if (subCategoriesError) throw subCategoriesError;
                if (reviewsError) throw reviewsError;
                if (siteContentError && siteContentError.code !== 'PGRST116') throw siteContentError; // Ignore "no rows" error
                if (ordersError) throw ordersError;

                setProducts((productsData as Product[]) || []);
                setCategories((categoriesData as Category[]) || []);
                setSubCategories((subCategoriesData as SubCategory[]) || []);
                setReviews((reviewsData as Review[]) || []);
                setOrders((ordersData as Order[]) || []);
                setSiteContent(siteContentData || mockSiteContent); // Fallback to mock if DB is empty

                await cartActions.initializeCart(user);
                
                if (user) {
                    const { data } = await supabase.from('user_wishlists').select('items').eq('user_id', user.id).single();
                    setWishlistItems(data?.items || []);
                } else {
                    const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
                    setWishlistItems(guestWishlist ? JSON.parse(guestWishlist) : []);
                }

            } catch (error: any) {
                console.error("Error loading initial data:", error);
                setProducts(mockProducts);
                setCategories(mockCategories);
                setSubCategories(mockSubCategories);
                setSiteContent(mockSiteContent);
                setToastMessage(`حدث خطأ في تحميل البيانات من الخادم. ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [user, cartActions]);

    // Sync wishlist to storage
    useEffect(() => {
        if(isLoading) return; // Don't sync during initial load
        if(user) {
            supabase.from('user_wishlists').upsert({ user_id: user.id, items: wishlistItems }).then();
        } else {
            localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, user, isLoading]);

    // Toast timeout
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Page loading indicator
    const handleNavigate = useCallback((newPage: Page) => {
        setIsPageLoading(true);
        window.scrollTo(0, 0);
        if(page === 'products' && newPage !== 'products') {
            setSearchQuery('');
        }
        setPage(newPage);
        setTimeout(() => setIsPageLoading(false), 300);
    }, [page]);
    
    // --- Handlers ---
    const handleProductSelect = (product: Product) => {
        setSelectedProductId(product.id);
        handleNavigate('productDetail');
    };
    
    const handleCategorySelect = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId);
        handleNavigate('products');
    };
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        handleNavigate('products');
    };

    const handleAddToCart = (product: Product, quantity: number) => {
        const result = cartActions.addToCart(product, quantity);
        setToastMessage(result.message);
    };

    const handleToggleWishlist = (productId: string) => {
        setWishlistItems(prev => {
            const isInWishlist = prev.includes(productId);
            if (isInWishlist) {
                setToastMessage("تمت الإزالة من قائمة الأمنيات.");
                return prev.filter(id => id !== productId);
            } else {
                setToastMessage("تمت الإضافة إلى قائمة الأمنيات!");
                return [...prev, productId];
            }
        });
    };

    const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
        const newOrderData = {
            ...orderData,
            date: new Date().toISOString(),
            status: 'Processing',
        };
        const { data, error } = await supabase.from('orders').insert(newOrderData).select().single();

        if (error || !data) {
            setToastMessage('عذراً، حدث خطأ أثناء تأكيد الطلب.');
            console.error(error);
            return;
        }

        const newOrder: Order = data;
        setOrders(prev => [newOrder, ...prev]);
        cartActions.clearCart(user);
        setLastOrderId(newOrder.id);
        handleNavigate('orderConfirmation');
    };
    
    const handleAddReview = async (reviewData: Omit<Review, 'id' | 'created_at'>) => {
       const newReviewData = { ...reviewData, created_at: new Date().toISOString() };
       const { data, error } = await supabase.from('reviews').insert(newReviewData).select().single();
       if (error || !data) {
           setToastMessage("حدث خطأ أثناء إضافة المراجعة.");
           console.error(error);
           return;
       }
       setReviews(prev => [data, ...prev]);
       setToastMessage("شكرًا لك! تمت إضافة مراجعتك.");
    };

    // --- Admin Handlers (with DB operations) ---
    const handleDeleteProduct = async (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const { error } = await supabase.from('products').delete().match({ id: productId });
        if (error) {
            setToastMessage(`فشل حذف المنتج: ${error.message}`);
        } else {
            setProducts(prev => prev.filter(p => p.id !== productId));
            cartActions.removeFromCart(productId, product.nameAr);
            setWishlistItems(prev => prev.filter(id => id !== productId));
            setReviews(prev => prev.filter(r => r.product_id !== productId));
            setToastMessage(`تم حذف المنتج "${product.nameAr}".`);
        }
    };
    
    const handleDeleteSubCategory = async (subCategoryId: string) => {
        const { error } = await supabase.from('sub_categories').delete().match({ id: subCategoryId });
        if (error) {
            setToastMessage(`فشل حذف الفئة الفرعية: ${error.message}`);
        } else {
            const productIdsToDelete = products.filter(p => p.subCategory.id === subCategoryId).map(p => p.id);
            productIdsToDelete.forEach(pid => handleDeleteProduct(pid));
            setSubCategories(prev => prev.filter(sc => sc.id !== subCategoryId));
            setToastMessage("تم حذف الفئة الفرعية بنجاح.");
        }
    };
    
    const handleDeleteCategory = async (categoryId: string) => {
        const { error } = await supabase.from('categories').delete().match({ id: categoryId });
        if (error) {
            setToastMessage(`فشل حذف الفئة: ${error.message}`);
        } else {
            const subCategoriesToDelete = subCategories.filter(sc => sc.mainCategoryId === categoryId);
            subCategoriesToDelete.forEach(sc => handleDeleteSubCategory(sc.id));
            setCategories(prev => prev.filter(c => c.id !== categoryId));
            setToastMessage("تم حذف الفئة بنجاح.");
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        const { error } = await supabase.from('orders').delete().match({ id: orderId });
        if (error) {
            setToastMessage(`فشل حذف الطلب: ${error.message}`);
        } else {
            setOrders(prev => prev.filter(o => o.id !== orderId));
            setToastMessage("تم حذف الطلب بنجاح.");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        const { error } = await supabase.from('reviews').delete().match({ id: reviewId });
        if (error) {
            setToastMessage(`فشل حذف المراجعة: ${error.message}`);
        } else {
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            setToastMessage("تم حذف المراجعة بنجاح.");
        }
    };
    
    const handleAddProduct = async (product: Product) => {
        const { subCategory, ...productData } = product;
        const payload = {
            ...productData,
            subCategoryId: subCategory.id
        };
        const { data, error } = await supabase.from('products').insert([payload]).select('*, subCategory:sub_categories(*)').single();
        if (error || !data) {
            setToastMessage(`فشل إضافة المنتج: ${error?.message}`);
        } else {
            setProducts(prev => [...prev, data as Product]);
            setToastMessage("تم إضافة المنتج بنجاح.");
        }
    };

    const handleUpdateProduct = async (product: Product) => {
        const { id, subCategory, ...updateData } = product;
        const payload = { ...updateData, subCategoryId: subCategory.id };
        const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*, subCategory:sub_categories(*)').single();
        if (error || !data) {
            setToastMessage(`فشل تحديث المنتج: ${error?.message}`);
        } else {
            setProducts(prev => prev.map(p => p.id === id ? (data as Product) : p));
            setToastMessage("تم تحديث المنتج بنجاح.");
        }
    };

    const handleUpdateSiteContent = async (content: SiteContent) => {
        // Assuming site_content table has one row with a known id, e.g., 1
        const { error } = await supabase.from('site_content').update(content).match({ id: 1 });
        if (error) {
            setToastMessage(`فشل تحديث محتوى الموقع: ${error.message}`);
        } else {
            setSiteContent(content);
            setToastMessage("تم تحديث محتوى الموقع بنجاح.");
        }
    };

    // --- Render Logic ---
    const renderPage = () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        const userOrders = user ? orders.filter(o => o.userId === user.id) : [];

        switch (page) {
            case 'home': return <HomePage products={products} categories={categories} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} onSelectCategory={handleCategorySelect} wishlistItems={wishlistItems} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} onNavigate={handleNavigate} siteContent={siteContent.homepage} />;
            case 'products': return <ProductsPage onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} initialSelectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} allProducts={products} allCategories={categories} allSubCategories={subCategories} wishlistItems={wishlistItems} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} />;
            case 'productDetail': return selectedProduct ? <ProductDetailPage product={selectedProduct} onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} categories={categories} allProducts={products} wishlistItems={wishlistItems} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} onAddReview={handleAddReview} /> : <p>Product not found.</p>;
            case 'deals': return <DealsPage onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} wishlistItems={wishlistItems} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} products={products} siteContent={siteContent.dealsPage} />;
            case 'cart': return <CartPage products={products} cartItems={cartItems} onUpdateQuantity={(pid, nq) => { const p = products.find(p=>p.id===pid); if(p) cartActions.updateQuantity(pid, nq, p.stock);}} onRemoveFromCart={(pid) => {const p = products.find(p=>p.id===pid); if (p) cartActions.removeFromCart(pid, p.nameAr);}} onNavigate={handleNavigate} setToastMessage={setToastMessage} />;
            case 'checkout': return <CheckoutPage products={products} cartItems={cartItems} onNavigate={handleNavigate} onPlaceOrder={handlePlaceOrder} />;
            case 'orderConfirmation': return <OrderConfirmationPage orderId={lastOrderId} onNavigate={handleNavigate} />;
            case 'admin': return <AdminPage 
                allProducts={products} 
                allCategories={categories} 
                allSubCategories={subCategories} 
                allOrders={orders} 
                allReviews={reviews} 
                siteContent={siteContent} 
                onUpdateSiteContent={handleUpdateSiteContent}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddCategory={async (c) => { const { data } = await supabase.from('categories').insert(c).select().single(); if(data) setCategories(prev => [...prev, data]); }}
                onUpdateCategory={async (c) => { const { data } = await supabase.from('categories').update(c).match({ id: c.id }).select().single(); if (data) setCategories(prev => prev.map(cat => cat.id === c.id ? data : cat)); }}
                onDeleteCategory={handleDeleteCategory}
                onAddSubCategory={async (sc) => { const { data } = await supabase.from('sub_categories').insert(sc).select().single(); if (data) setSubCategories(prev => [...prev, data]); }}
                onUpdateSubCategory={async (sc) => { const { data } = await supabase.from('sub_categories').update(sc).match({ id: sc.id }).select().single(); if (data) setSubCategories(prev => prev.map(sub => sub.id === sc.id ? data : sub)); }}
                onDeleteSubCategory={handleDeleteSubCategory}
                onUpdateOrderStatus={async (orderId, status) => { const { data } = await supabase.from('orders').update({ status }).match({ id: orderId }).select().single(); if (data) setOrders(ords => ords.map(o => o.id === orderId ? data : o));}}
                onDeleteOrder={handleDeleteOrder}
                onDeleteReview={handleDeleteReview}
            />;
            case 'ordersHistory': return <OrdersHistoryPage orders={userOrders} products={products} onNavigate={handleNavigate} onRequestOrderCancellation={async (id) => { const { data } = await supabase.from('orders').update({ status: 'Cancelled' }).match({ id: id }).select().single(); if (data) setOrders(ords => ords.map(o => o.id === id ? data : o)); setToastMessage(`تم طلب إلغاء الطلب ${id}.`);}} />;
            case 'wishlist': return <WishlistPage wishlistItems={wishlistItems} allProducts={products} onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} />;
            case 'auth': return <AuthPage onNavigate={handleNavigate} onAuthError={setToastMessage} />;
            case 'privacy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
            case 'about': return <AboutUsPage onNavigate={handleNavigate} />;
            case 'terms': return <TermsAndConditionsPage onNavigate={handleNavigate} />;
            default: return <HomePage products={products} categories={categories} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} setToastMessage={setToastMessage} onSelectCategory={handleCategorySelect} wishlistItems={wishlistItems} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} onNavigate={handleNavigate} siteContent={siteContent.homepage} />;
        }
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    const showHeaderFooter = page !== 'admin';

    return (
        <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <ProgressBar isLoading={isPageLoading} />
            {showHeaderFooter && (
                <Header 
                    onNavigate={handleNavigate} 
                    onSearch={handleSearch} 
                    cartItemCount={cartItems.length}
                    wishlistItemCount={wishlistItems.length}
                    allProducts={products}
                    onProductSelect={handleProductSelect}
                />
            )}
            <main className={`flex-grow ${!showHeaderFooter ? '' : 'pt-0'}`}>
                {renderPage()}
            </main>
            {showHeaderFooter && (
                <Footer onNavigate={handleNavigate} onSubscribe={setToastMessage} />
            )}
            
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
            
            {quickViewProduct && (
                <QuickViewModal 
                    product={quickViewProduct} 
                    onClose={() => setQuickViewProduct(null)} 
                    onAddToCart={handleAddToCart}
                    categories={categories}
                    setToastMessage={setToastMessage}
                    onNavigateToProduct={() => {
                        handleProductSelect(quickViewProduct);
                        setQuickViewProduct(null);
                    }}
                />
            )}
            
            {user && (
                 <ChatWidget 
                    userId={user.id}
                    conversation={conversations.find(c => c.id === user.id)}
                    messages={messages.filter(m => m.conversationId === user.id)}
                    onSendMessage={() => {}}
                    onMarkAsRead={() => {}}
                    onUserTyping={() => {}}
                    onOpenChat={() => {}}
                />
            )}
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
