import React from 'react';

const MenuIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;


interface AdminHeaderProps {
    onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
    return (
        <header className="lg:hidden bg-white shadow-md h-16 flex items-center px-4 sticky top-0 z-30 flex-shrink-0">
            <button 
                onClick={onToggleSidebar} 
                className="text-gray-600 hover:text-blue-600"
                aria-label="Open sidebar"
            >
                <MenuIcon />
            </button>
             <div className="flex-grow text-center">
                 <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
             </div>
             <div className="w-6"></div> {/* Spacer to balance the title */}
        </header>
    );
};

export default AdminHeader;