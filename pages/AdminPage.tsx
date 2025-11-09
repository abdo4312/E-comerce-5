import React, { useState } from 'react';
import { Product, Category, SubCategory, Order, Review, SiteContent } from '../types';

import AdminSidebar, { AdminView } from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardView from '../components/admin/DashboardView';
import ProductsView from '../components/admin/ProductsView';
import CategoriesView from '../components/admin/CategoriesView';
import OrdersView from '../components/admin/OrdersView';
import ReviewsView from '../components/admin/ReviewsView';
import BestsellersView from '../components/admin/BestsellersView';
import ContentView from '../components/admin/ContentView';
import ChatView from '../components/admin/ChatView';

interface AdminPageProps {
  allProducts: Product[];
  allCategories: Category[];
  allSubCategories: SubCategory[];
  allOrders: Order[];
  allReviews: Review[];
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  // Add/Update handlers
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onAddSubCategory: (subCategory: SubCategory) => void;
  onUpdateSubCategory: (subCategory: SubCategory) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  // Delete handlers
  onDeleteProduct: (productId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onDeleteSubCategory: (subCategoryId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onDeleteReview: (reviewId: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const { 
        allProducts, allCategories, allSubCategories, allOrders, allReviews, siteContent, onUpdateSiteContent,
        onAddProduct, onUpdateProduct, onDeleteProduct,
        onAddCategory, onUpdateCategory, onDeleteCategory,
        onAddSubCategory, onUpdateSubCategory, onDeleteSubCategory,
        onUpdateOrderStatus, onDeleteOrder,
        onDeleteReview
    } = props;
    
    // Mock data for chat, as it's not implemented yet
    const [conversations] = useState([]);
    const [messages] = useState([]);

    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView products={allProducts} orders={allOrders} categories={allCategories} />;
            case 'products':
                return <ProductsView 
                            products={allProducts} 
                            categories={allCategories} 
                            subCategories={allSubCategories}
                            onAddProduct={onAddProduct}
                            onUpdateProduct={onUpdateProduct}
                            onDeleteProduct={onDeleteProduct}
                        />;
            case 'categories':
                return <CategoriesView 
                            categories={allCategories}
                            subCategories={allSubCategories}
                            onAddCategory={onAddCategory}
                            onUpdateCategory={onUpdateCategory}
                            onDeleteCategory={onDeleteCategory}
                            onAddSubCategory={onAddSubCategory}
                            onUpdateSubCategory={onUpdateSubCategory}
                            onDeleteSubCategory={onDeleteSubCategory}
                        />;
            case 'orders':
                return <OrdersView 
                            orders={allOrders} 
                            products={allProducts} 
                            onUpdateOrderStatus={onUpdateOrderStatus} 
                            onDeleteOrder={onDeleteOrder}
                        />;
            case 'reviews':
                return <ReviewsView 
                            reviews={allReviews} 
                            products={allProducts} 
                            onDeleteReview={onDeleteReview} 
                        />;
            case 'bestsellers':
                return <BestsellersView products={allProducts} onUpdateProduct={onUpdateProduct} />;
            case 'content':
                return <ContentView siteContent={siteContent} onUpdateSiteContent={onUpdateSiteContent} allProducts={allProducts} allCategories={allCategories} />;
            case 'chat':
                return <ChatView conversations={conversations} messages={messages} onSendMessage={()=>{}} onMarkAsRead={()=>{}}/>;
            default:
                return <div>Select a view</div>;
        }
    };

    return (
        <div dir="rtl" className="bg-gray-100 min-h-screen flex">
            <AdminSidebar 
                currentView={currentView} 
                onSetView={setCurrentView} 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex-1 flex flex-col">
                <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;