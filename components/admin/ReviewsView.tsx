import React, { useState, useMemo } from 'react';
import { Review, Product } from '../../types';

interface ReviewsViewProps {
    reviews: Review[];
    products: Product[];
    onDeleteReview: (reviewId: string) => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const ReviewsView: React.FC<ReviewsViewProps> = ({ reviews, products, onDeleteReview }) => {
    
    const [filterRating, setFilterRating] = useState(0);

    const handleDelete = (reviewId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه المراجعة؟')) {
            onDeleteReview(reviewId);
        }
    };
    
    const getProductById = (productId: string) => products.find(p => p.id === productId);
    
    const filteredReviews = useMemo(() => {
        return reviews.filter(review => filterRating === 0 || review.rating === filterRating);
    }, [reviews, filterRating]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">إدارة المراجعات</h1>

             <div className="bg-white p-4 rounded-lg shadow-md">
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">تصفية حسب التقييم:</label>
                <select 
                    id="rating-filter"
                    value={filterRating} 
                    onChange={e => setFilterRating(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-1/3 p-2.5"
                >
                    <option value={0}>كل التقييمات</option>
                    <option value={5}>5 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={3}>3 نجوم</option>
                    <option value={2}>نجمتان</option>
                    <option value={1}>نجمة واحدة</option>
                </select>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 min-w-[768px]">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">المنتج</th>
                                <th scope="col" className="px-6 py-3">المستخدم</th>
                                <th scope="col" className="px-6 py-3">التقييم</th>
                                <th scope="col" className="px-6 py-3">المراجعة</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3 text-center">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map(review => {
                                const product = getProductById(review.product_id);
                                return (
                                    <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product?.nameAr || 'منتج غير معروف'}</td>
                                        <td className="px-6 py-4">{review.user_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm truncate" title={review.review_text}>{review.review_text}</td>
                                        <td className="px-6 py-4">{new Date(review.created_at).toLocaleDateString('ar-EG')}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleDelete(review.id)} className="font-medium text-red-600 hover:underline">حذف</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredReviews.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        لا توجد مراجعات تطابق الفلتر.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewsView;
