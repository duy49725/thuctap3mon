import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createReview, resetCreateReviewState } from '@/store/shopping/review-slice';
import { AppDispatch, RootState } from '@/store/store';
import StarRatingComponent from '@/common/star-rating';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/common/uploadMultiIImage';

interface ReviewFormProps {
  productId: number | undefined;
  productName: string | undefined;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, productName }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<{ imageUrl: string; }[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.userReview.createReview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please share your thoughts about this product.",
        variant: "destructive"
      });
      return;
    }

    await dispatch(createReview({
      productId,
      rating,
      comment,
      images
    }));
  };

  useEffect(() => {
    if (success) {
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted and is pending approval. Thank you for your feedback!"
      });
      setRating(0);
      setComment('');
      setImages([]);
      dispatch(resetCreateReviewState());
    }

    if (error) {
      toast({
        title: "Submission Failed",
        description: error,
        variant: "destructive"
      });
    }
  }, [success, error, dispatch]);

  const handleImageUpload = (newImages: { imageUrl: string; }[]) => {
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience about {productName}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className='flex items-center'>
              <Label htmlFor="rating">Rating</Label>
              <StarRatingComponent rating={rating} handleRatingChange={setRating} />
            </div>
            {rating === 0 && <p className="text-sm text-red-500">Please select a rating</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Write your review here..."
              className="min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Add Photos (Optional)</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              maxImages={5}
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image.imageUrl} alt={`Review image ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;