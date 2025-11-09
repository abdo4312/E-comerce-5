import React, { useState, useMemo } from 'react';
import { Category, SubCategory } from '../types';

interface SidebarProps {
  allCategories: Category[];
  allSubCategories: SubCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedSubCategoryIds: string[];
  onSubCategoryChange: (subCategoryIds: string[]) => void;
  priceRange: { min: number; max: number };
  onPriceChange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  minRating: number;
  onRatingChange: (rating: number) => void;
  availableMaterials: string[];
  selectedMaterials: string[];
  onMaterialChange: (materials: string[]) => void;
  onClearFilters: () => void;
}

const XIcon: React.FC = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const FilterIcon: React.FC = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>;

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);


const SidebarContent: React.FC<Omit<SidebarProps, 'maxPrice'>> = (props) => {
    const {
        allCategories, allSubCategories, selectedCategoryId, onSelectCategory,
        selectedSubCategoryIds, onSubCategoryChange, priceRange, onPriceChange,
        minRating, onRatingChange, availableMaterials, selectedMaterials, onMaterialChange,
        onClearFilters
    } = props;
    
    const relevantSubCategories = useMemo(() => {
        if (!selectedCategoryId) return [];
        return allSubCategories.filter(sc => sc.mainCategoryId === selectedCategoryId);
    }, [selectedCategoryId, allSubCategories]);

    const handleSubCategoryToggle = (subCategoryId: string) => {
        const newSelection = selectedSubCategoryIds.includes(subCategoryId)
            ? selectedSubCategoryIds.filter(id => id !== subCategoryId)
            : [...selectedSubCategoryIds, subCategoryId];
        onSubCategoryChange(newSelection);
    };

    const handleMaterialToggle = (material: string) => {
        const newSelection = selectedMaterials.includes(material)
            ? selectedMaterials.filter(m => m !== material)
            : [...selectedMaterials, material];
        onMaterialChange(newSelection);
    };

    const handleRatingClick = (rating: number) => {
        // Allow toggling the rating filter off
        if (minRating === rating) {
            onRatingChange(0);
        } else {
            onRatingChange(rating);
        }
    };

    return (
         <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-4">الفئات</h3>
                <ul className="space-y-2">
                    <li>
                        <button onClick={() => onSelectCategory(null)} className={`w-full text-right px-2 py-1 rounded ${!selectedCategoryId ? 'font-bold text-orange-600' : 'text-gray-700 hover:text-orange-500'}`}>
                            كل المنتجات
                        </button>
                    </li>
                    {allCategories.map(cat => (
                        <li key={cat.id}>
                            <button onClick={() => onSelectCategory(cat.id)} className={`w-full text-right px-2 py-1 rounded ${selectedCategoryId === cat.id ? 'font-bold text-orange-600' : 'text-gray-700 hover:text-orange-500'}`}>
                                {cat.nameAr}
                            </button>
                             {selectedCategoryId === cat.id && relevantSubCategories.length > 0 && (
                                <ul className="pr-4 mt-2 space-y-2 border-r-2 border-orange-200">
                                    {relevantSubCategories.map(subCat => (
                                        <li key={subCat.id}>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubCategoryIds.includes(subCat.id)}
                                                    onChange={() => handleSubCategoryToggle(subCat.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-600">{subCat.nameAr}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                 <h3 className="text-xl font-bold mb-4">السعر</h3>
                <div className="flex items-center space-x-2">
                    <input type="number" placeholder="الأدنى" value={priceRange.min} onChange={(e) => onPriceChange({ ...priceRange, min: Number(e.target.value) })} className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                    <span>-</span>
                    <input type="number" placeholder="الأعلى" value={priceRange.max} onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })} className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"/>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">التقييم</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                        <button key={rating} onClick={() => handleRatingClick(rating)} className={`w-full flex items-center space-x-2 p-2 rounded ${minRating === rating ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}>
                            <div className="flex">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} />)}</div>
                            <span className="text-sm text-gray-600">&amp; أعلى</span>
                        </button>
                    ))}
                </div>
            </div>

            {availableMaterials.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4">المادة</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableMaterials.map(material => (
                            <div key={material}>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMaterials.includes(material)}
                                        onChange={() => handleMaterialToggle(material)}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-600">{material}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <button onClick={onClearFilters} className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors">
                مسح كل الفلاتر
            </button>
        </div>
    );
}

const Sidebar: React.FC<SidebarProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                 <button 
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <FilterIcon />
                    <span>تصفية</span>
                </button>
            </div>

             {/* Mobile Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
                    <div className="relative h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">تصفية النتائج</h2>
                            <button type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500" onClick={() => setIsOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <XIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto">
                            <SidebarContent {...props} />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="p-6 bg-white rounded-lg shadow-md sticky top-28">
                    <SidebarContent {...props} />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;