import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
// FIX: Changed import path for Page type from '../App' to '../types'.
import { Page } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (page: Page) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
    const breadcrumbItems = [
        { name: 'الرئيسية', onClick: () => onNavigate('home') },
        { name: 'سياسة الخصوصية' }
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="bg-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">سياسة الخصوصية</h1>
                        <p className="text-center text-gray-500 mb-10">آخر تحديث: 25 يوليو 2024</p>
                        
                        <div className="prose prose-lg max-w-none text-gray-700 leading-8">
                            <p>
                                مرحبًا بك في متجر "قرطاسية". نحن نأخذ خصوصيتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عندما تستخدم موقعنا.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">1. المعلومات التي نجمعها</h2>
                            <p>
                                نقوم بجمع أنواع مختلفة من المعلومات لتقديم وتحسين خدماتنا لك:
                            </p>
                            <ul className="list-disc pr-5 space-y-2">
                                <li>
                                    <strong>المعلومات الشخصية:</strong> عند إنشاء حساب أو إجراء عملية شراء، قد نطلب منك تقديم معلومات تعريف شخصية مثل اسمك الكامل، وعنوان بريدك الإلكتروني، ورقم هاتفك، وعنوان الاستلام.
                                </li>
                                <li>
                                    <strong>معلومات الطلبات:</strong> نحتفظ بسجل للمنتجات التي تشتريها وتفاصيل طلباتك.
                                </li>
                                <li>
                                    <strong>معلومات التواصل:</strong> إذا تواصلت معنا عبر خدمة العملاء أو الدردشة، فإننا نحتفظ بسجل لمحادثاتك.
                                </li>
                            </ul>

                            <h2 className="font-bold text-2xl mt-8 mb-4">2. كيف نستخدم معلوماتك</h2>
                            <p>
                                نستخدم المعلومات التي نجمعها للأغراض التالية:
                            </p>
                            <ul className="list-disc pr-5 space-y-2">
                                <li>لتوفير وإدارة خدماتنا، بما في ذلك معالجة طلباتك وتسهيل عمليات الدفع.</li>
                                <li>للتواصل معك بشأن طلبك، أو حسابك، أو الرد على استفساراتك.</li>
                                <li>لتحسين وتخصيص تجربتك على موقعنا.</li>
                                <li>للامتثال لالتزاماتنا القانونية.</li>
                            </ul>

                            <h2 className="font-bold text-2xl mt-8 mb-4">3. مشاركة المعلومات</h2>
                            <p>
                                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
                            </p>
                             <ul className="list-disc pr-5 space-y-2">
                                <li>مع مزودي الخدمات الذين يساعدوننا في عملياتنا التجارية (مثل معالجة الدفع والشحن). هؤلاء المزودون ملزمون بحماية معلوماتك ولا يُسمح لهم باستخدامها إلا للغرض المحدد.</li>
                                <li>إذا طُلب منا ذلك بموجب القانون أو استجابة لعملية قانونية سارية.</li>
                            </ul>

                            <h2 className="font-bold text-2xl mt-8 mb-4">4. أمان البيانات</h2>
                            <p>
                                نحن نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو الإتلاف. نستخدم منصة Supabase كخلفية، والتي توفر ميزات أمان قوية لحماية بياناتك.
                            </p>
                            
                            <h2 className="font-bold text-2xl mt-8 mb-4">5. حقوقك</h2>
                            <p>
                                لديك الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها وتحديثها. يمكنك مراجعة سجل طلباتك من خلال صفحة "طلباتي" بعد تسجيل الدخول. إذا كنت ترغب في حذف حسابك، يرجى التواصل معنا.
                            </p>

                            <h2 className="font-bold text-2xl mt-8 mb-4">6. تغييرات على هذه السياسة</h2>
                            <p>
                                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة. ننصحك بمراجعة هذه السياسة بشكل دوري.
                            </p>
                            
                            <h2 className="font-bold text-2xl mt-8 mb-4">7. تواصل معنا</h2>
                            <p>
                                إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا عبر:
                            </p>
                             <ul className="list-disc pr-5 space-y-2">
                                <li>البريد الإلكتروني: support@stationery.com</li>
                                <li>الهاتف: +20 123 456 7890</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;