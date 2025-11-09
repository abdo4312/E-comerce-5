import React from 'react';

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l4 4-4 4-4-4 4-4zM1 11l4 4-4 4-4-4 4-4zm15 0l4 4-4 4-4-4 4-4z" /></svg>;
const ChatBubbleLeftRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l4 4-4 4-4-4 4-4zM1 11l4 4-4 4-4-4 4-4zm15 0l4 4-4 4-4-4 4-4z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


export type AdminView = 'dashboard' | 'products' | 'categories' | 'orders' | 'reviews' | 'content' | 'bestsellers' | 'chat';

interface AdminSidebarProps {
    currentView: AdminView;
    onSetView: (view: AdminView) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white font-bold shadow-lg'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
    >
        {icon}
        <span className="flex-grow text-right">{label}</span>
    </button>
);


const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onSetView, isOpen, onToggle }) => {
    
    const navItems = [
        { view: 'dashboard', label: 'لوحة المعلومات', icon: <HomeIcon /> },
        { view: 'products', label: 'المنتجات', icon: <CubeIcon /> },
        { view: 'categories', label: 'الفئات', icon: <CollectionIcon /> },
        { view: 'orders', label: 'الطلبات', icon: <ShoppingBagIcon /> },
        { view: 'reviews', label: 'المراجعات', icon: <StarIcon /> },
        { view: 'bestsellers', label: 'الأكثر مبيعًا', icon: <SparklesIcon /> },
        { view: 'content', label: 'المحتوى', icon: <DocumentTextIcon /> },
        { view: 'chat', label: 'المحادثات', icon: <ChatBubbleLeftRightIcon /> },
    ];

    const handleViewChange = (view: AdminView) => {
        onSetView(view);
        if (window.innerWidth < 1024) { // Close sidebar on mobile after selection
            onToggle();
        }
    }
    
    const SidebarContent = () => (
         <div className="h-full bg-white flex flex-col">
            <div className="p-4 border-b h-16 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم</h1>
                <button onClick={onToggle} className="lg:hidden text-gray-500 hover:text-gray-700">
                    <XIcon />
                </button>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <NavLink 
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        onClick={() => handleViewChange(item.view as AdminView)}
                    />
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onToggle}></div>}
            
            {/* Sidebar */}
            <aside className={`fixed lg:relative inset-y-0 right-0 z-40 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
                <SidebarContent />
            </aside>
        </>
    );
};

export default AdminSidebar;
