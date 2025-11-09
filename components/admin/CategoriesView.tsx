import React, { useState } from 'react';
import { Category, SubCategory } from '../../types';
import CategoryFormModal from './CategoryFormModal';
import SubCategoryFormModal from './SubCategoryFormModal';

interface CategoriesViewProps {
    categories: Category[];
    subCategories: SubCategory[];
    onAddCategory: (category: Category) => void;
    onUpdateCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
    onAddSubCategory: (subCategory: SubCategory) => void;
    onUpdateSubCategory: (subCategory: SubCategory) => void;
    onDeleteSubCategory: (subCategoryId: string) => void;
}

const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const CategoriesView: React.FC<CategoriesViewProps> = (props) => {
    const { categories, subCategories, onDeleteCategory, onDeleteSubCategory } = props;

    const [categoryModal, setCategoryModal] = useState<{ isOpen: boolean; category: Category | null }>({ isOpen: false, category: null });
    const [subCategoryModal, setSubCategoryModal] = useState<{ isOpen: boolean; subCategory: SubCategory | null; mainCategoryId?: string }>({ isOpen: false, subCategory: null });

    const handleDeleteCategory = (id: string) => {
        if (window.confirm('تحذير: سيتم حذف هذه الفئة وجميع الفئات الفرعية المرتبطة بها. هل أنت متأكد؟')) {
            onDeleteCategory(id);
        }
    };
    
    const handleDeleteSubCategory = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الفئة الفرعية؟')) {
            onDeleteSubCategory(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
                <button
                    onClick={() => setCategoryModal({ isOpen: true, category: null })}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon />
                    <span>إضافة فئة رئيسية</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                    <div key={category.id} className="bg-white rounded-lg shadow-md flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{category.nameAr}</h2>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <button onClick={() => setCategoryModal({ isOpen: true, category })} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex-grow">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">الفئات الفرعية:</h3>
                            <div className="space-y-2">
                                {subCategories.filter(sc => sc.mainCategoryId === category.id).map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                        <span className="text-gray-700">{sub.nameAr}</span>
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button onClick={() => setSubCategoryModal({ isOpen: true, subCategory: sub })} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                                            <button onClick={() => handleDeleteSubCategory(sub.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </div>
                                    </div>
                                ))}
                                 {subCategories.filter(sc => sc.mainCategoryId === category.id).length === 0 && (
                                     <p className="text-sm text-gray-400 text-center py-2">لا توجد فئات فرعية.</p>
                                 )}
                            </div>
                        </div>
                        <div className="p-4 border-t">
                            <button 
                                onClick={() => setSubCategoryModal({ isOpen: true, subCategory: null, mainCategoryId: category.id })}
                                className="w-full text-sm flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <PlusIcon />
                                <span>إضافة فئة فرعية</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categoryModal.isOpen && (
                <CategoryFormModal
                    category={categoryModal.category}
                    onClose={() => setCategoryModal({ isOpen: false, category: null })}
                    onAddCategory={props.onAddCategory}
                    onUpdateCategory={props.onUpdateCategory}
                />
            )}

            {subCategoryModal.isOpen && (
                <SubCategoryFormModal
                    subCategory={subCategoryModal.subCategory}
                    mainCategoryId={subCategoryModal.mainCategoryId}
                    allCategories={categories}
                    onClose={() => setSubCategoryModal({ isOpen: false, subCategory: null })}
                    onAddSubCategory={props.onAddSubCategory}
                    onUpdateSubCategory={props.onUpdateSubCategory}
                />
            )}
        </div>
    );
};

export default CategoriesView;
