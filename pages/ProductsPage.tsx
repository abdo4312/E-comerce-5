import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, SubCategory, Page } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Fuse from 'fuse.js';

interface ProductsPageProps {
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  setToastMessage: (message: string) => void;
  initialSelectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  searchQuery: string;
  onClearSearch: () => void;
  allProducts: Product[];
  allCategories: Category[];
  allSubCategories: SubCategory[];
  wishlistItems: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = (props) => {
  const { 
    onNavigate, onProductSelect, onAddToCart, setToastMessage, initialSelectedCategoryId, 
    searchQuery, onClearSearch, allProducts, allCategories, allSubCategories,
    wishlistItems, onToggleWishlist, onQuickView 
  } = props;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialSelectedCategoryId);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<string[]>([]);
  
  const maxPrice = useMemo(() => Math.ceil(Math.max(...allProducts.map(p => p.price), 1000) / 100) * 100, [allProducts]);
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });
  const [minRating, setMinRating] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    setSelectedCategoryId(initialSelectedCategoryId);
    setCurrentPage(1);
    setSelectedSubCategoryIds([]);
  }, [initialSelectedCategoryId]);

  useEffect(() => {
    setPriceRange({ min: 0, max: maxPrice });
  }, [maxPrice]);

  const fuse = useMemo(() => {
      const options: Fuse.IFuseOptions<Product> = {
          keys: ['nameAr', 'description', 'subCategory.nameAr', 'material'],
          includeScore: true,
          threshold: 0.4,
          minMatchCharLength: 2,
      };
      return new Fuse(allProducts, options);
  }, [allProducts]);

  const handleClearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryIds([]);
    setPriceRange({ min: 0, max: maxPrice });
    setMinRating(0);
    setSelectedMaterials([]);
    setSortBy('default');
    if(searchQuery) {
        onClearSearch();
    }
  };
  
  const availableMaterials = useMemo(() => {
      const materials = new Set<string>();
      allProducts.forEach(p => {
          if (p.material) {
              p.material.split(',').forEach(m => materials.add(m.trim()));
          }
      });
      return Array.from(materials).sort();
  }, [allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
        filtered = fuse.search(searchQuery).map(result => result.item);
    } else {
        if (selectedCategoryId) {
            filtered = filtered.filter(p => p.subCategory.mainCategoryId === selectedCategoryId);
            if (selectedSubCategoryIds.length > 0) {
                filtered = filtered.filter(p => selectedSubCategoryIds.includes(p.subCategory.id));
            }
        }
        
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (minRating > 0) {
            filtered = filtered.filter(p => p.ratings.average >= minRating);
        }

        if (selectedMaterials.length > 0) {
            filtered = filtered.filter(p => 
                p.material && selectedMaterials.some(sm => p.material!.split(',').map(m => m.trim()).includes(sm))
            );
        }
    }

    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.ratings.average - a.ratings.average);
      case 'newest':
        return filtered.sort((a, b) => (a.isNew === b.isNew)? 0 : a.isNew? -1 : 1);
      default:
        // For search, default sort is relevance from Fuse.js, otherwise keep natural order.
        return filtered;
    }
  }, [allProducts, searchQuery, selectedCategoryId, selectedSubCategoryIds, priceRange, minRating, selectedMaterials, sortBy, fuse]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const breadcrumbCategory = allCategories.find(c => c.id === selectedCategoryId);
  const breadcrumbItems = [
    { name: 'الرئيسية', onClick: () => onNavigate('home') },
    searchQuery 
        ? { name: `نتائج البحث عن: "${searchQuery}"`}
        : (breadcrumbCategory 
            ? { name: breadcrumbCategory.nameAr, onClick: () => setSelectedCategoryId(breadcrumbCategory.id) }
            : { name: 'كل المنتجات' })
  ];

  const handleRatingChange = (rating: number) => {
    // Allow toggling the rating filter off by clicking the same rating again
    setMinRating(prev => (prev === rating ? 0 : rating));
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-8 rtl:space-x-reverse items-start">
          <Sidebar
            allCategories={allCategories}
            allSubCategories={allSubCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(catId) => { setSelectedCategoryId(catId); setSelectedSubCategoryIds([]); setCurrentPage(1); onClearSearch(); }}
            selectedSubCategoryIds={selectedSubCategoryIds}
            onSubCategoryChange={(subCatIds) => { setSelectedSubCategoryIds(subCatIds); setCurrentPage(1); }}
            priceRange={priceRange}
            onPriceChange={(range) => { setPriceRange(range); setCurrentPage(1); }}
            maxPrice={maxPrice}
            minRating={minRating}
            onRatingChange={handleRatingChange}
            availableMaterials={availableMaterials}
            selectedMaterials={selectedMaterials}
            onMaterialChange={(materials) => { setSelectedMaterials(materials); setCurrentPage(1); }}
            onClearFilters={() => { handleClearFilters(); setCurrentPage(1); }}
          />

          <main className="flex-grow w-full lg:w-auto">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600">
                    عرض <span className="font-bold">{currentProducts.length}</span> من <span className="font-bold">{filteredAndSortedProducts.length}</span> منتج
                </p>
                {searchQuery && (
                    <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-md">
                        <button onClick={onClearSearch} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                        <p className="text-sm">نتائج البحث عن: <span className="font-semibold text-gray-800">{searchQuery}</span></p>
                    </div>
                )}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <label htmlFor="sort" className="text-sm font-medium">ترتيب حسب:</label>
                    <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm">
                        <option value="default">افتراضي</option>
                        <option value="price-asc">السعر: من الأقل للأعلى</option>
                        <option value="price-desc">السعر: من الأعلى للأقل</option>
                        <option value="rating">الأعلى تقييمًا</option>
                        <option value="newest">الأحدث</option>
                    </select>
                </div>
            </div>

            {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {currentProducts.map(product => (
                    <ProductCard
                    key={product.id}
                    product={product}
                    onProductSelect={onProductSelect}
                    onAddToCart={onAddToCart}
                    setToastMessage={setToastMessage}
                    isInWishlist={wishlistItems.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={onQuickView}
                    />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800">لا توجد منتجات تطابق بحثك</h2>
                    <p className="text-gray-500 mt-2">حاول تغيير الفلاتر أو البحث عن شيء آخر.</p>
                </div>
            )}
            
            {totalPages > 1 && (
                <nav className="mt-12 flex justify-center">
                    <ul className="flex items-center -space-x-px h-10 text-base rtl:space-x-reverse">
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i}>
                                <button onClick={() => setCurrentPage(i + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${currentPage === i + 1 ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;