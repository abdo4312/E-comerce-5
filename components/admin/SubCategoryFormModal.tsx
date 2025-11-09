import React, { useState, useEffect } from 'react';
import { SubCategory, Category } from '../../types';

interface SubCategoryFormModalProps {
    subCategory: SubCategory | null;
    mainCategoryId?: string; // For adding new subcategory to a specific main category
    allCategories: Category[];
    onClose: () => void;
    onAddSubCategory: (subCategory: SubCategory) => void;
    onUpdateSubCategory: (subCategory: SubCategory) => void;
}

const SubCategoryFormModal: React.FC<SubCategoryFormModalProps> = (props) => {
    const { subCategory, mainCategoryId, allCategories, onClose, onAddSubCategory, onUpdateSubCategory } = props;
    const isEditing = !!subCategory;
    
    const [formData, setFormData] = useState({
        nameAr: '',
        mainCategoryId: mainCategoryId || subCategory?.mainCategoryId || (allCategories.length > 0 ? allCategories[0].id : '')
    });

    useEffect(() => {
        if (subCategory) {
            setFormData({
                nameAr: subCategory.nameAr,
                mainCategoryId: subCategory.mainCategoryId
            });
        }
    }, [subCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const subCategoryData: SubCategory = {
            id: subCategory?.id || `s${Date.now()}`,
            slug: formData.nameAr.toLowerCase().replace(/\s+/g, '-'),
            nameAr: formData.nameAr,
            mainCategoryId: formData.mainCategoryId,
        };

        if (isEditing) {
            onUpdateSubCategory(subCategoryData);
        } else {
            onAddSubCategory(subCategoryData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{isEditing ? 'تعديل الفئة الفرعية' : 'إضافة فئة فرعية'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="mainCategoryId" className="block text-sm font-medium text-gray-700">الفئة الرئيسية</label>
                             <select name="mainCategoryId" id="mainCategoryId" value={formData.mainCategoryId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                                {allCategories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">اسم الفئة الفرعية</label>
                            <input type="text" name="nameAr" id="nameAr" value={formData.nameAr} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2 rtl:space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            إلغاء
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            {isEditing ? 'حفظ التغييرات' : 'إضافة الفئة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubCategoryFormModal;
