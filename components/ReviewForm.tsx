import React, { useState } from 'react';
import StarRatingInput from './StarRatingInput';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; reviewText: string }) => void;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('يرجى تحديد تقييم بالنجوم.');
      return;
    }
    if (reviewText.trim().length < 10) {
      setError('يرجى كتابة مراجعة لا تقل عن 10 أحرف.');
      return;
    }
    setError('');
    onSubmit({ rating, reviewText });
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">أضف مراجعتك</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">تقييمك</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">مراجعتك</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="ما رأيك في هذا المنتج؟"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-wait"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال المراجعة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
