import React, { useState } from 'react';
import { SiteContent, Product, Category, Page, BannerContent, HomePageSection } from '../../types';

// --- Icons ---
const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ArrowUpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>;
const ArrowDownIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;

// --- Helper Components ---
const SectionAccordion: React.FC<{ title: string; children: React.ReactNode; onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void; }> = ({ title, children, onRemove, onMoveUp, onMoveDown }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center p-4 border-b">
        <div className="flex-grow">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full text-right font-bold text-lg text-gray-800">{title}</button>
        </div>
        <div className="flex items-center gap-2">
            <button type="button" onClick={onMoveUp} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><ArrowUpIcon/></button>
            <button type="button" onClick={onMoveDown} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><ArrowDownIcon/></button>
            <button type="button" onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon/></button>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const BannerSubForm: React.FC<{ banner: BannerContent; onBannerChange: (updates: Partial<BannerContent>) => void; allCategories: Category[]; title: string; onRemove: () => void; }> = ({ banner, onBannerChange, allCategories, title, onRemove }) => {
    const pages: Page[] = ['home', 'products', 'deals', 'about'];
    const [imageInputType, setImageInputType] = useState<'url' | 'file'>(
        banner.image && banner.image.startsWith('data:image') ? 'file' : 'url'
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64Url = loadEvent.target?.result as string;
                onBannerChange({ image: base64Url });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputTypeChange = (type: 'url' | 'file') => {
        setImageInputType(type);
        if (type === 'url' && banner.image.startsWith('data:image')) {
            onBannerChange({ image: '' });
        } else if (type === 'file' && !banner.image.startsWith('data:image')) {
            onBannerChange({ image: '' });
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 relative">
            <div className="flex justify-between items-center">
                <h5 className="font-semibold text-gray-600">{title}</h5>
                <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة البانر</label>
                <div className="flex items-center gap-2 mb-3">
                    <button type="button" onClick={() => handleInputTypeChange('url')} className={`px-3 py-1 text-sm rounded-md transition-colors ${imageInputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رابط</button>
                    <button type="button" onClick={() => handleInputTypeChange('file')} className={`px-3 py-1 text-sm rounded-md transition-colors ${imageInputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>رفع ملف</button>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="flex-grow">
                        {imageInputType === 'url' ? (
                            <input 
                                type="text" 
                                value={banner.image} 
                                onChange={(e) => onBannerChange({ image: e.target.value })} 
                                className="mt-1 block w-full input-style"
                                placeholder="https://example.com/image.jpg"
                            />
                        ) : (
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>
                    {banner.image && <img src={banner.image} alt="معاينة" className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-200" />}
                </div>
            </div>

            <div><label className="block text-sm font-medium text-gray-700">العنوان الرئيسي</label><input type="text" value={banner.title} onChange={e => onBannerChange({ title: e.target.value })} className="mt-1 block w-full input-style" /></div>
            <div><label className="block text-sm font-medium text-gray-700">العنوان الفرعي</label><textarea value={banner.subtitle} onChange={e => onBannerChange({ subtitle: e.target.value })} rows={2} className="mt-1 block w-full input-style" /></div>
            <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">نص الزر</label><input type="text" value={banner.buttonText} onChange={e => onBannerChange({ buttonText: e.target.value })} className="mt-1 block w-full input-style" /></div>
                <div><label className="block text-sm font-medium text-gray-700">تخطيط النص</label><select value={banner.layout} onChange={e => onBannerChange({ layout: e.target.value as any })} className="mt-1 block w-full input-style"><option value="text-center">وسط</option><option value="text-left">يسار</option><option value="text-right">يمين</option></select></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                 <div><label className="block text-sm font-medium text-gray-700">نوع الرابط</label><select value={banner.linkType} onChange={e => onBannerChange({ linkType: e.target.value as any, link: e.target.value === 'page' ? pages[0] : allCategories[0].id })} className="mt-1 block w-full input-style"><option value="page">صفحة</option><option value="category">فئة</option></select></div>
                 <div><label className="block text-sm font-medium text-gray-700">الوجهة</label>
                    {banner.linkType === 'page' ? (<select value={banner.link} onChange={e => onBannerChange({ link: e.target.value })} className="mt-1 block w-full input-style">{pages.map(p => <option key={p} value={p}>{p}</option>)}</select>) : (<select value={banner.link} onChange={e => onBannerChange({ link: e.target.value })} className="mt-1 block w-full input-style">{allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nameAr}</option>)}</select>)}
                </div>
            </div>
             <div className="flex items-center gap-2"><input type="checkbox" checked={banner.enabled} onChange={e => onBannerChange({ enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label className="text-sm font-medium text-gray-700">مُفعّل</label></div>
        </div>
    );
};

// --- Section-specific Forms ---
const HeroSectionForm: React.FC<{ section: any; onUpdate: (updates: Partial<HomePageSection>) => void; allCategories: Category[] }> = ({ section, onUpdate, allCategories }) => {
    const handleBannerChange = (index: number, updates: Partial<BannerContent>) => {
        const newBanners = [...section.banners];
        newBanners[index] = { ...newBanners[index], ...updates };
        onUpdate({ banners: newBanners });
    };
    const addBanner = () => {
        const newBanner: BannerContent = { enabled: true, image: "", title: "عنوان جديد", subtitle: "", buttonText: "تسوق الآن", link: 'products', linkType: 'page', layout: 'text-center' };
        onUpdate({ banners: [...section.banners, newBanner] });
    };
    const removeBanner = (index: number) => {
        onUpdate({ banners: section.banners.filter((_: any, i: number) => i !== index) });
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={section.enabled} onChange={e => onUpdate({ enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label className="text-sm font-medium text-gray-700">تفعيل القسم</label></div>
            <div className="space-y-4">
                {section.banners.map((banner: BannerContent, index: number) => (
                    <BannerSubForm key={index} banner={banner} onBannerChange={(updates) => handleBannerChange(index, updates)} allCategories={allCategories} title={`الشريحة ${index + 1}`} onRemove={() => removeBanner(index)} />
                ))}
            </div>
            <button type="button" onClick={addBanner} className="text-sm flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"><PlusIcon /> إضافة شريحة</button>
        </div>
    );
};

const CategoryGridSectionForm: React.FC<{ section: any; onUpdate: (updates: Partial<HomePageSection>) => void; allCategories: Category[] }> = ({ section, onUpdate, allCategories }) => {
    const handleCategoryToggle = (catId: string) => {
        const newIds = section.categoryIds.includes(catId)
            ? section.categoryIds.filter((id: string) => id !== catId)
            : [...section.categoryIds, catId];
        onUpdate({ categoryIds: newIds });
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={section.enabled} onChange={e => onUpdate({ enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label className="text-sm font-medium text-gray-700">تفعيل القسم</label></div>
            <div><label className="block text-sm font-medium text-gray-700">عنوان القسم</label><input type="text" value={section.title} onChange={e => onUpdate({ title: e.target.value })} className="mt-1 block w-full input-style" /></div>
            <div>
                <label className="block text-sm font-medium text-gray-700">الفئات المعروضة</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"><input type="checkbox" checked={section.categoryIds.includes(cat.id)} onChange={() => handleCategoryToggle(cat.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>{cat.nameAr}</label>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductCarouselSectionForm: React.FC<{ section: any; onUpdate: (updates: Partial<HomePageSection>) => void; }> = ({ section, onUpdate }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={section.enabled} onChange={e => onUpdate({ enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label className="text-sm font-medium text-gray-700">تفعيل القسم</label></div>
            <div><label className="block text-sm font-medium text-gray-700">عنوان القسم</label><input type="text" value={section.title} onChange={e => onUpdate({ title: e.target.value })} className="mt-1 block w-full input-style" /></div>
            <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">فلتر المنتجات</label><select value={section.filter} onChange={e => onUpdate({ filter: e.target.value })} className="mt-1 block w-full input-style"><option value="bestseller">الأكثر مبيعًا</option><option value="new">وصل حديثًا</option><option value="sale">تخفيضات</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700">تصميم العرض</label><select value={section.layout} onChange={e => onUpdate({ layout: e.target.value })} className="mt-1 block w-full input-style"><option value="default">شريط تمرير أفقي</option><option value="stacked-card">بطاقات مكدسة</option></select></div>
            </div>
        </div>
    );
};

const PromoBannerSectionForm: React.FC<{ section: any; onUpdate: (updates: Partial<HomePageSection>) => void; allCategories: Category[] }> = ({ section, onUpdate, allCategories }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={section.enabled} onChange={e => onUpdate({ enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label className="text-sm font-medium text-gray-700">تفعيل القسم</label></div>
            <div><label className="block text-sm font-medium text-gray-700">نوع البانر</label><select value={section.bannerType} onChange={e => onUpdate({ bannerType: e.target.value })} className="mt-1 block w-full input-style"><option value="full">كامل العرض</option><option value="split">مقسوم</option></select></div>
            <BannerSubForm banner={section.content} onBannerChange={(updates) => onUpdate({ content: { ...section.content, ...updates } })} allCategories={allCategories} title="محتوى البانر" onRemove={() => {}} />
        </div>
    );
};


// --- Main Component ---
interface ContentViewProps {
    siteContent: SiteContent;
    onUpdateSiteContent: (content: SiteContent) => void;
    allProducts: Product[];
    allCategories: Category[];
}

const ContentView: React.FC<ContentViewProps> = ({ siteContent, onUpdateSiteContent, allProducts, allCategories }) => {
    const [formData, setFormData] = useState<SiteContent>(siteContent);

    const handleUpdateSection = (id: string, updates: Partial<HomePageSection>) => {
        const newSections = formData.homepage.sections.map(section => 
            section.id === id ? { ...section, ...updates } : section
        );
        setFormData(prev => ({ ...prev, homepage: { ...prev.homepage, sections: newSections } }));
    };

    const handleAddSection = (type: HomePageSection['type']) => {
        let newSection: HomePageSection;
        const newId = `hps-${Date.now()}`;
        switch (type) {
            case 'hero': newSection = { id: newId, type: 'hero', enabled: true, banners: [] }; break;
            case 'categoryGrid': newSection = { id: newId, type: 'categoryGrid', enabled: true, title: 'فئات مميزة', categoryIds: [] }; break;
            case 'productCarousel': newSection = { id: newId, type: 'productCarousel', enabled: true, title: 'منتجات جديدة', filter: 'new', layout: 'default', linkToPage: 'products' }; break;
            case 'promoBanner': newSection = { id: newId, type: 'promoBanner', enabled: true, bannerType: 'full', content: { enabled: true, image: "", title: "عنوان البانر", subtitle: "", buttonText: "تسوق", link: 'products', linkType: 'page', layout: 'text-center' } }; break;
            default: return;
        }
        setFormData(prev => ({ ...prev, homepage: { ...prev.homepage, sections: [...prev.homepage.sections, newSection] } }));
    };
    
    const handleRemoveSection = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
            const newSections = formData.homepage.sections.filter((section) => section.id !== id);
            setFormData(prev => ({ ...prev, homepage: { ...prev.homepage, sections: newSections } }));
        }
    };
    
    const handleMoveSection = (id: string, direction: 'up' | 'down') => {
        const newSections = [...formData.homepage.sections];
        const index = newSections.findIndex(s => s.id === id);
        if (index === -1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setFormData(prev => ({ ...prev, homepage: { ...prev.homepage, sections: newSections } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSiteContent(formData);
    };

    const sectionTitleMap = {
        hero: 'شريط عرض رئيسي (Hero)',
        categoryGrid: 'شبكة فئات',
        productCarousel: 'شريط عرض منتجات',
        promoBanner: 'بانر إعلاني',
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
             <style>{`.input-style { display: block; width: 100%; border-radius: 0.375rem; border-color: #D1D5DB; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); } .input-style:focus { border-color: #3B82F6; --tw-ring-color: #3B82F6; }`}</style>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">إدارة محتوى الصفحة الرئيسية</h1>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">حفظ التغييرات</button>
            </div>
            
            <div className="space-y-6">
                {formData.homepage.sections.map((section, index) => (
                    <SectionAccordion 
                        key={section.id} 
                        title={`${index + 1}. ${sectionTitleMap[section.type]}`}
                        onRemove={() => handleRemoveSection(section.id)}
                        onMoveUp={() => handleMoveSection(section.id, 'up')}
                        onMoveDown={() => handleMoveSection(section.id, 'down')}
                    >
                        {section.type === 'hero' && <HeroSectionForm section={section} onUpdate={(updates) => handleUpdateSection(section.id, updates)} allCategories={allCategories} />}
                        {section.type === 'categoryGrid' && <CategoryGridSectionForm section={section} onUpdate={(updates) => handleUpdateSection(section.id, updates)} allCategories={allCategories} />}
                        {section.type === 'productCarousel' && <ProductCarouselSectionForm section={section} onUpdate={(updates) => handleUpdateSection(section.id, updates)} />}
                        {section.type === 'promoBanner' && <PromoBannerSectionForm section={section} onUpdate={(updates) => handleUpdateSection(section.id, updates)} allCategories={allCategories} />}
                    </SectionAccordion>
                ))}
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة قسم جديد</h3>
                <div className="flex flex-wrap gap-4">
                     <button type="button" onClick={() => handleAddSection('hero')} className="btn-add-section">إضافة Hero Carousel</button>
                     <button type="button" onClick={() => handleAddSection('categoryGrid')} className="btn-add-section">إضافة شبكة فئات</button>
                     <button type="button" onClick={() => handleAddSection('productCarousel')} className="btn-add-section">إضافة شريط منتجات</button>
                     <button type="button" onClick={() => handleAddSection('promoBanner')} className="btn-add-section">إضافة بانر إعلاني</button>
                </div>
                 <style>{`.btn-add-section { background-color: #F3F4F6; color: #1F2937; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; } .btn-add-section:hover { background-color: #E5E7EB; }`}</style>
            </div>
        </form>
    );
};

export default ContentView;