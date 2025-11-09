


import React, { useState, useEffect, useMemo, useRef } from 'react';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import Fuse from 'fuse.js';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onSearch: (query: string) => void;
    cartItemCount: number;
    wishlistItemCount: number;
    allProducts: Product[];
    onProductSelect: (product: Product) => void;
}

const Logo: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
        <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <span className="text-2xl font-black text-gray-800">قرطاسية</span>
    </a>
);

const SearchIcon: React.FC = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const HeartIcon: React.FC = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const ShoppingCartIcon: React.FC = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MenuIcon: React.FC = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon: React.FC = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const HighlightedText: React.FC<{ text: string; indices: readonly Fuse.Range[] }> = ({ text, indices }) => {
    if (!indices || indices.length === 0) {
        return <>{text}</>;
    }

    const parts = [];
    let lastIndex = 0;

    indices.forEach(([start, end], i) => {
        if (lastIndex < start) {
            parts.push(<span key={`unmatched-${i}`}>{text.substring(lastIndex, start)}</span>);
        }
        parts.push(
            <strong key={`matched-${i}`} className="font-bold text-orange-600 bg-orange-50 rounded">
                {text.substring(start, end + 1)}
            </strong>
        );
        lastIndex = end + 1;
    });

    if (lastIndex < text.length) {
        parts.push(<span key="unmatched-end">{text.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
};

const SuggestionsList: React.FC<{ suggestions: Fuse.FuseResult<Product>[]; onSuggestionClick: (product: Product) => void; className?: string }> = ({ suggestions, onSuggestionClick, className = '' }) => (
    <div className={`w-full bg-white rounded-lg shadow-lg border z-50 overflow-hidden ${className}`} role="listbox">
        <ul className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {suggestions.map((result) => {
                 const product = result.item;
                 const nameMatch = result.matches?.find(m => m.key === 'nameAr');

                return (
                    <li key={product.id}>
                        <button 
                            onClick={() => onSuggestionClick(product)}
                            className="w-full text-right flex items-center p-3 hover:bg-gray-50 transition-colors"
                            role="option"
                            aria-selected="false"
                        >
                            <img src={product.images[0].url} alt={product.nameAr} className="w-12 h-12 object-cover rounded-md ml-4" />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800">
                                    {nameMatch ? <HighlightedText text={product.nameAr} indices={nameMatch.indices} /> : product.nameAr}
                                </p>
                                <p className="text-sm text-orange-500 font-bold">{product.price.toFixed(2)} جنيه</p>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    </div>
);

const NoResults: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full bg-white rounded-lg shadow-lg border z-50 p-4 ${className}`} role="status">
        <p className="text-center text-gray-500">لم يتم العثور على نتائج.</p>
    </div>
);


const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch, cartItemCount, wishlistItemCount, allProducts, onProductSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Fuse.FuseResult<Product>[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

    const fuse = useMemo(() => {
        const options: Fuse.IFuseOptions<Product> = {
            keys: ['nameAr', 'subCategory.nameAr', 'description'],
            includeScore: true,
            includeMatches: true, // Enable matches for highlighting
            threshold: 0.4,
            minMatchCharLength: 2,
        };
        return new Fuse(allProducts, options);
    }, [allProducts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

     useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileSearchOpen(false);
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileSearchOpen || isMobileMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            if(isMobileSearchOpen) mobileSearchInputRef.current?.focus();
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileSearchOpen, isMobileMenuOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuggestionsVisible(false);
        setIsMobileSearchOpen(false);
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchQuery('');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 1) {
            const results = fuse.search(query).slice(0, 5);
            setSuggestions(results);
            setIsSuggestionsVisible(true);
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    };

    const handleSuggestionClick = (product: Product) => {
        onProductSelect(product);
        setSearchQuery('');
        setSuggestions([]);
        setIsSuggestionsVisible(false);
        setIsMobileSearchOpen(false);
    };

    const handleMobileLinkClick = (page: Page) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };
    
    const hasTypedSearch = searchQuery.length > 1;
    const showSuggestions = isSuggestionsVisible && hasTypedSearch && suggestions.length > 0;
    const showNoResults = isSuggestionsVisible && hasTypedSearch && suggestions.length === 0;

    return (
        <>
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Logo onNavigate={onNavigate} />
                    
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="text-gray-600 hover:text-orange-500 font-semibold transition-colors">الرئيسية</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }} className="text-gray-600 hover:text-orange-500 font-semibold transition-colors">المنتجات</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('deals'); }} className="text-gray-600 hover:text-orange-500 font-semibold transition-colors">العروض</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="text-gray-600 hover:text-orange-500 font-semibold transition-colors">عن المتجر</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('ordersHistory'); }} className="text-gray-600 hover:text-orange-500 font-semibold transition-colors">طلباتي</a>
                    </nav>

                    <div className="flex items-center space-x-4">
                         <div ref={searchContainerRef} className="relative hidden md:block">
                            <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => hasTypedSearch && setIsSuggestionsVisible(true)}
                                    placeholder="ابحث عن منتج..."
                                    className="w-64 bg-gray-100 border-transparent rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    aria-haspopup="listbox"
                                    aria-expanded={isSuggestionsVisible}
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <SearchIcon />
                                </button>
                            </form>
                            {showSuggestions && <SuggestionsList suggestions={suggestions} onSuggestionClick={handleSuggestionClick} className="absolute top-full mt-2 max-w-md" />}
                            {showNoResults && <NoResults className="absolute top-full mt-2 w-full max-w-md" />}
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden p-2 text-gray-500 hover:text-orange-500 transition-colors">
                                <SearchIcon />
                            </button>
                            <div className="relative">
                                {user ? (
                                    <>
                                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-2">
                                            <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full" />
                                            <span className="hidden sm:inline font-semibold">{user.user_metadata.full_name}</span>
                                        </button>
                                        {isMenuOpen && (
                                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('ordersHistory'); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">سجل الطلبات</a>
                                                <button onClick={signOut} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">تسجيل الخروج</button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                     <button onClick={() => onNavigate('auth')} className="p-2 text-gray-500 hover:text-orange-500 transition-colors font-semibold">
                                        تسجيل الدخول
                                    </button>
                                )}
                            </div>

                             <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('wishlist'); }} className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors">
                                 <HeartIcon />
                                 {wishlistItemCount > 0 && (
                                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                         {wishlistItemCount}
                                     </span>
                                 )}
                             </a>
                             <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('cart'); }} className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors">
                                 <ShoppingCartIcon />
                                 {cartItemCount > 0 && (
                                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                         {cartItemCount}
                                     </span>
                                 )}
                             </a>
                             <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-gray-500 hover:text-orange-500 transition-colors md:hidden"
                                aria-label="Open menu"
                            >
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 animate-fade-in md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg p-6 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8">
                        <Logo onNavigate={(page) => handleMobileLinkClick(page)} />
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
                            <XIcon />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('home'); }} className="text-gray-700 hover:text-orange-500 font-semibold text-lg p-2 rounded-md transition-colors">الرئيسية</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('products'); }} className="text-gray-700 hover:text-orange-500 font-semibold text-lg p-2 rounded-md transition-colors">المنتجات</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('deals'); }} className="text-gray-700 hover:text-orange-500 font-semibold text-lg p-2 rounded-md transition-colors">العروض</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('about'); }} className="text-gray-700 hover:text-orange-500 font-semibold text-lg p-2 rounded-md transition-colors">عن المتجر</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('ordersHistory'); }} className="text-gray-700 hover:text-orange-500 font-semibold text-lg p-2 rounded-md transition-colors">طلباتي</a>
                    </nav>
                </div>
            </div>
        )}

        {isMobileSearchOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 animate-fade-in" onClick={() => setIsMobileSearchOpen(false)}>
                <div className="bg-white p-4 shadow-lg animate-slide-down" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            ref={mobileSearchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => hasTypedSearch && setIsSuggestionsVisible(true)}
                            placeholder="ابحث عن منتج..."
                            className="w-full bg-gray-100 border-transparent rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <SearchIcon />
                        </button>
                    </form>
                    {showSuggestions && <SuggestionsList suggestions={suggestions} onSuggestionClick={handleSuggestionClick} className="mt-2" />}
                    {showNoResults && <NoResults className="mt-2" />}
                </div>
            </div>
        )}
        </>
    );
};

export default Header;