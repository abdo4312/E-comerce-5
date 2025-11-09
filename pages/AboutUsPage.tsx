

import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface AboutUsPageProps {
  onNavigate: (page: Page) => void;
}

const TeamMemberCard: React.FC<{ name: string; title: string; imageUrl: string; bio: string }> = ({ name, title, imageUrl, bio }) => (
    <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
        <img className="w-32 h-32 rounded-full mx-auto mb-4" src={imageUrl} alt={name} />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-orange-500 font-semibold">{title}</p>
        <p className="text-gray-600 mt-2 text-sm">{bio}</p>
    </div>
);


const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        { name: 'عن المتجر' }
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="bg-white">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-orange-100 to-blue-100 py-20 text-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl font-black text-gray-800">عن قرطاسية</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
                            قصتنا، شغفنا، والتزامنا بتوفير أفضل الأدوات لإلهام إبداعك.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Our Story */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">قصتنا</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                بدأت "قرطاسية" كفكرة بسيطة: إنشاء مكان واحد يجمع كل ما يحتاجه الطلاب والمبدعون والمحترفون من أدوات مكتبية ودراسية عالية الجودة. انطلقنا من شغفنا بالأدوات التي تساعد على تنظيم الأفكار وتحويلها إلى واقع ملموس. من قلم بسيط إلى أحدث الأدوات المكتبية، نؤمن بأن الأداة المناسبة يمكن أن تحدث فرقًا كبيرًا في رحلة التعلم والإبداع.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                على مر السنين، كبرنا لنصبح وجهة موثوقة للآلاف، مع الحفاظ على قيمنا الأساسية: الجودة، التنوع، وخدمة العملاء المتميزة.
                            </p>
                        </section>

                        {/* Our Mission */}
                        <section className="mb-16 bg-gray-50 p-8 rounded-lg shadow-md">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">مهمتنا ورؤيتنا</h2>
                            <div className="grid md:grid-cols-2 gap-8 text-center">
                                <div>
                                    <h3 className="text-2xl font-semibold text-orange-600 mb-3">مهمتنا</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        توفير تشكيلة واسعة من المنتجات المكتبية والدراسية التي تلهم الإبداع، تدعم التعلم، وتساعد على تحقيق النجاح، مع تقديم تجربة تسوق سهلة وممتعة.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-blue-600 mb-3">رؤيتنا</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        أن نكون الخيار الأول والأكثر ثقة في منطقة الشرق الأوسط لكل ما يتعلق بالأدوات المكتبية والمدرسية، وأن نكون شريكًا في كل قصة نجاح وإبداع.
                                    </p>
                                </div>
                            </div>
                        </section>
                        
                        {/* Meet the Team */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">تعرف على فريقنا</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <TeamMemberCard 
                                    name="أحمد علي" 
                                    title="المؤسس والرئيس التنفيذي" 
                                    imageUrl="https://i.pravatar.cc/150?u=ahmed" 
                                    bio="شغوف بتوفير الأدوات التي تساعد الناس على تحقيق إمكاناتهم الكاملة." 
                                />
                                <TeamMemberCard 
                                    name="فاطمة الزهراء" 
                                    title="مديرة المنتجات" 
                                    imageUrl="https://i.pravatar.cc/150?u=fatima"
                                    bio="تبحث دائمًا عن أفضل المنتجات وأكثرها ابتكارًا لتقديمها لعملائنا." 
                                />
                                 <TeamMemberCard 
                                    name="يوسف خالد" 
                                    title="قائد خدمة العملاء" 
                                    imageUrl="https://i.pravatar.cc/150?u=youssef"
                                    bio="يضمن حصول كل عميل على تجربة استثنائية ودعم لا مثيل له." 
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUsPage;