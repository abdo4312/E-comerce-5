import React, { useState, useEffect } from 'react';
import { Category } from '../../types';

interface CategoryFormModalProps {
    category: Category | null;
    onClose: () => void;
    onAddCategory: (category: Category) => void;
    onUpdateCategory: (category: Category) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, onClose, onAddCategory, onUpdateCategory }) => {
    const isEditing = !!category;
    
    const [formData, setFormData] = useState({
        nameAr: '',
        image: ''
    });
    const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');

    useEffect(() => {
        if (category) {
            setFormData({
                nameAr: category.nameAr,
                image: category.image
            });
             if (category.image.startsWith('data:image')) {
                setImageInputType('file');
            } else {
                setImageInputType('url');
            }
        } else {
            setFormData({ nameAr: '', image: '' });
            setImageInputType('url');
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64Url = loadEvent.target?.result as string;
                setFormData(prev => ({ ...prev, image: base64Url }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const categoryData: Category = {
            id: category?.id || `c${Date.now()}`,
            slug: formData.nameAr.toLowerCase().replace(/\s+/g, '-'),
            ...formData,
        };

        if (isEditing) {
            onUpdateCategory(categoryData);
        } else {
            onAddCategory(categoryData);
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
                    <h2 className="text-xl font-bold">{isEditing ? 'تعديل الفئة الرئيسية' : 'إضافة فئة رئيسية'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">اسم الفئة</label>
                            <input type="text" name="nameAr" id="nameAr" value={formData.nameAr} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">صورة الفئة</label>
                            <div className="flex items-center gap-2 mb-3">
                                <button type="button" onClick={() => setImageInputType('url')} className={`px-3 py-1 text-sm rounded-md transition-colors ${imageInputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رابط</button>
                                <button type="button" onClick={() => setImageInputType('file')} className={`px-3 py-1 text-sm rounded-md transition-colors ${imageInputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رفع ملف</button>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="flex-grow">
                                    {imageInputType === 'url' ? (
                                        <input 
                                            type="text" 
                                            name="image" 
                                            id="image" 
                                            value={formData.image} 
                                            onChange={handleChange} 
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                                            placeholder="https://example.com/image.jpg" 
                                            required 
                                        />
                                    ) : (
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            required={!formData.image}
                                        />
                                    )}
                                </div>
                                {formData.image && <img src={formData.image} alt="معاينة" className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-200" />}
                            </div>

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

export default CategoryFormModal;