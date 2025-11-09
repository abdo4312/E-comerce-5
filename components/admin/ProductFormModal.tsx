import React, { useState, useEffect } from 'react';
import { Product, Category, SubCategory, Image } from '../../types';

interface ProductFormModalProps {
    product: Product | null;
    onClose: () => void;
    onAddProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    categories: Category[];
    subCategories: SubCategory[];
}

const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onAddProduct, onUpdateProduct, categories, subCategories }) => {
    const isEditing = !!product;
    const initialFormState = {
        nameAr: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        stock: 0,
        subCategoryId: subCategories.length > 0 ? subCategories[0].id : '',
        weight: undefined,
        dimensions: '',
        material: '',
        images: [{ url: '', alt: '' }] as Image[],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imageInputTypes, setImageInputTypes] = useState<Array<'url' | 'file'>>(['url']);


    useEffect(() => {
        if (product) {
            setFormData({
                nameAr: product.nameAr,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                stock: product.stock,
                subCategoryId: product.subCategory.id,
                weight: product.weight,
                dimensions: product.dimensions || '',
                material: product.material || '',
                images: product.images.length > 0 ? product.images : [{ url: '', alt: '' }],
            });
            setImageInputTypes(Array(product.images.length > 0 ? product.images.length : 1).fill('url'));
        } else {
             setFormData(initialFormState);
             setImageInputTypes(['url']);
        }
    }, [product, subCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'weight' ? parseFloat(value) || 0 : value }));
    };

    const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
        const updatedImages = [...formData.images];
        updatedImages[index] = { ...updatedImages[index], [field]: value };
        setFormData(prev => ({ ...prev, images: updatedImages }));
    };

    const handleInputTypeChange = (index: number, type: 'url' | 'file') => {
        const newTypes = [...imageInputTypes];
        newTypes[index] = type;
        setImageInputTypes(newTypes);
        handleImageChange(index, 'url', '');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64Url = loadEvent.target?.result as string;
                handleImageChange(index, 'url', base64Url);
            };
            reader.readAsDataURL(file);
        }
    };

    const addImageField = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: '', alt: '' }]
        }));
        setImageInputTypes(prev => [...prev, 'url']);
    };

    const removeImageField = (index: number) => {
        if (formData.images.length <= 1) {
            handleImageChange(index, 'url', '');
            handleImageChange(index, 'alt', '');
            return;
        }
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImageInputTypes(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedSubCategory = subCategories.find(sc => sc.id === formData.subCategoryId);
        if (!selectedSubCategory) {
            alert('Please select a valid subcategory.');
            return;
        }
        
        const validImages = formData.images.filter(img => img.url.trim() !== '' && img.alt.trim() !== '');
        if (validImages.length === 0) {
            alert('يجب إضافة صورة واحدة على الأقل مع رابط ونص بديل.');
            return;
        }

        const { subCategoryId, ...restOfFormData } = formData;

        const productData: Product = {
            ...(product || {
                id: `p${Date.now()}`,
                slug: formData.nameAr.toLowerCase().replace(/\s+/g, '-'),
                ratings: { average: 0, count: 0 },
                isNew: true,
                isBestseller: false,
                colors: [],
            }),
            ...restOfFormData,
            images: validImages,
            subCategory: selectedSubCategory,
            originalPrice: formData.originalPrice || undefined,
            weight: formData.weight || undefined,
            dimensions: formData.dimensions || undefined,
            material: formData.material || undefined,
        };

        if (isEditing) {
            onUpdateProduct(productData);
        } else {
            onAddProduct(productData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">اسم المنتج</label>
                            <input type="text" name="nameAr" id="nameAr" value={formData.nameAr} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                             <label htmlFor="description" className="block text-sm font-medium text-gray-700">الوصف</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">صور المنتج</label>
                            <div className="space-y-4">
                                {formData.images.map((image, index) => {
                                    const inputType = imageInputTypes[index] || 'url';
                                    return (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 font-semibold">{index + 1}.</span>
                                                    <button type="button" onClick={() => handleInputTypeChange(index, 'url')} className={`px-3 py-1 text-sm rounded-md transition-colors ${inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رابط</button>
                                                    <button type="button" onClick={() => handleInputTypeChange(index, 'file')} className={`px-3 py-1 text-sm rounded-md transition-colors ${inputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رفع ملف</button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                                                    aria-label="Remove image"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="flex-grow space-y-3">
                                                    {inputType === 'url' ? (
                                                        <input 
                                                            type="text"
                                                            placeholder="رابط الصورة (URL)"
                                                            value={image.url}
                                                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                            required={index === 0}
                                                        />
                                                    ) : (
                                                        <input 
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, index)}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            required={index === 0 && !image.url}
                                                        />
                                                    )}
                                                    <input 
                                                        type="text"
                                                        placeholder="نص بديل (Alt Text)"
                                                        value={image.alt}
                                                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        required={index === 0}
                                                    />
                                                </div>
                                                {image.url && <img src={image.url} alt="معاينة" className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-200" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={addImageField}
                                className="mt-3 text-sm flex items-center gap-2 rtl:gap-1 text-blue-600 font-semibold hover:text-blue-800"
                            >
                                <PlusIcon />
                                إضافة صورة أخرى
                            </button>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
                                <input type="number" name="weight" id="weight" value={formData.weight || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" step="0.01" />
                            </div>
                            <div>
                                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">الأبعاد</label>
                                <input type="text" name="dimensions" id="dimensions" value={formData.dimensions || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 20cm x 15cm" />
                            </div>
                            <div>
                                <label htmlFor="material" className="block text-sm font-medium text-gray-700">المادة</label>
                                <input type="text" name="material" id="material" value={formData.material || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700">الفئة الفرعية</label>
                            <select name="subCategoryId" id="subCategoryId" value={formData.subCategoryId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                                {subCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.nameAr} ({categories.find(c=>c.id === sc.mainCategoryId)?.nameAr})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر</label>
                                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" step="0.01" required />
                            </div>
                             <div>
                                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">السعر الأصلي (اختياري)</label>
                                <input type="number" name="originalPrice" id="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" step="0.01" />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">المخزون</label>
                                <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2 rtl:space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            إلغاء
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            {isEditing ? 'حفظ التغييرات' : 'إضافة المنتج'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;