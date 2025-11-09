import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface TermsAndConditionsPageProps {
  onNavigate: (page: Page) => void;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onNavigate }) => {
    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        { name: 'الشروط والأحكام' }
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="bg-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">الشروط والأحكام</h1>
                        <p className="text-center text-gray-500 mb-10">آخر تحديث: 25 يوليو 2024</p>
                        
                        <div className="prose prose-lg max-w-none text-gray-700 leading-8">
                            <h2 className="font-bold text-2xl mt-8 mb-4">1. مقدمة</h2>
                            <p>
                                مرحبًا بك في متجر "قرطاسية". تحكم هذه الشروط والأحكام استخدامك لموقعنا والخدمات التي نقدمها. من خلال الوصول إلى الموقع أو استخدامه، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك استخدام خدمتنا.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">2. استخدام الحساب</h2>
                            <p>
                                عند إنشاء حساب معنا، يجب عليك تزويدنا بمعلومات دقيقة وكاملة وحديثة في جميع الأوقات. يعتبر عدم القيام بذلك خرقًا للشروط، مما قد يؤدي إلى الإنهاء الفوري لحسابك على خدمتنا. أنت مسؤول عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة وعن أي أنشطة أو إجراءات تتم بموجب كلمة المرور الخاصة بك.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">3. الطلبات والدفع</h2>
                            <p>
                                نحن نحتفظ بالحق في رفض أو إلغاء طلبك في أي وقت لأسباب معينة بما في ذلك على سبيل المثال لا الحصر: توفر المنتج، أو وجود أخطاء في وصف أو سعر المنتج، أو خطأ في طلبك، أو لأسباب أخرى. نوفر حاليًا خيار "الدفع عند الاستلام" من المكتبة كوسيلة دفع أساسية.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">4. الملكية الفكرية</h2>
                            <p>
                                الخدمة ومحتواها الأصلي وميزاتها ووظائفها هي وستظل ملكية حصرية لمتجر "قرطاسية" ومرخصيها. الخدمة محمية بموجب حقوق النشر والعلامات التجارية والقوانين الأخرى في مصر والبلدان الأجنبية.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">5. تحديد المسؤولية</h2>
                            <p>
                                لن يكون متجر "قرطاسية"، ولا مديروه أو موظفوه أو شركاؤه أو وكلاؤه أو موردوه، مسؤولين بأي حال من الأحوال عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية، بما في ذلك على سبيل المثال لا الحصر، خسارة الأرباح أو البيانات أو الاستخدام أو الشهرة أو غيرها من الخسائر غير الملموسة، الناتجة عن وصولك إلى الخدمة أو استخدامها أو عدم القدرة على الوصول إليها أو استخدامها.
                            </p>
                            
                            <h2 className="font-bold text-2xl mt-8 mb-4">6. القانون الحاكم</h2>
                            <p>
                                تخضع هذه الشروط وتفسر وفقًا لقوانين جمهورية مصر العربية، بغض النظر عن تعارضها مع أحكام القانون.
                            </p>
                            
                            <h2 className="font-bold text-2xl mt-8 mb-4">7. تغييرات على الشروط</h2>
                            <p>
                                نحن نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت. سنقدم إشعارًا قبل 30 يومًا على الأقل من دخول أي شروط جديدة حيز التنفيذ. من خلال الاستمرار في الوصول إلى خدمتنا أو استخدامها بعد أن تصبح هذه المراجعات فعالة، فإنك توافق على الالتزام بالشروط المعدلة.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">8. تواصل معنا</h2>
                            <p>
                                إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني: support@stationery.com.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsAndConditionsPage;