"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRatingComponent from "@/components/common/star-rating.jsx";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// AI Recommendations Component
const AIRecommendations = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentProduct) {
      getAIRecommendations();
    }
  }, [currentProduct]);

  const getAIRecommendations = async () => {
    if (!currentProduct) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: currentProduct })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
      console.error('AI Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load recommendations at the moment.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={getAIRecommendations}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations.length) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 You might also like
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <img 
                src={rec.imageUrl} 
                alt={rec.title} 
                className="w-full h-32 object-cover rounded mb-3"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                }}
              />
              <h4 className="font-medium text-sm mb-1 line-clamp-2">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mb-1">{rec.category}</p>
              <p className="text-sm font-bold text-primary mb-2">{rec.price}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {rec.description}
              </p>
              {rec.reason && (
                <p className="text-xs italic text-blue-600 mb-3">
                  "{rec.reason}"
                </p>
              )}
              <Button size="sm" className="w-full">
                View Product
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Review Analysis Component
const ReviewAnalysis = ({ reviews }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reviews.length >= 3) {
      analyzeReviews();
    }
  }, [reviews]);

  const analyzeReviews = async () => {
    setLoading(true);
    
    try {
      const reviewTexts = reviews.map(r => ({
        rating: r.reviewValue,
        text: r.reviewMessage,
        date: r.createdAt
      }));

      const response = await fetch('/api/analyze-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews: reviewTexts })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Review analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analysis) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Review Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analysis.overallSentiment && (
            <div>
              <Label className="text-sm font-medium">Overall Sentiment</Label>
              <p className="text-sm text-muted-foreground">{analysis.overallSentiment}</p>
            </div>
          )}
          
          {analysis.commonPraises && analysis.commonPraises.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-green-600">Most Praised</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {analysis.commonPraises.map((praise, idx) => (
                  <li key={idx}>{praise}</li>
                ))}
              </ul>
            </div>
          )}
          
          {analysis.commonConcerns && analysis.commonConcerns.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-orange-600">Common Concerns</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {analysis.commonConcerns.map((concern, idx) => (
                  <li key={idx}>{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProductReviews({ productId, currentUser, currentProduct }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Safely access the review slice with defaults
  const { isLoading = false, reviews = [] } = useSelector(
    (state) => state.shopReview || {}
  );

  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);

  // Fetch reviews when productId changes
  useEffect(() => {
    if (productId) {
      dispatch(getReviews(productId));
    }
  }, [dispatch, productId]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.reviewValue, 0) / reviews.length 
    : 0;

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Please login to add a review",
        variant: "destructive",
      });
      return;
    }

    if (!reviewMsg.trim() || rating === 0) return;

    try {
      setIsSubmitting(true);
      await dispatch(
        addReview({
          productId,
          userId: currentUser.id,
          userName: currentUser.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      ).unwrap();

      // Refresh reviews after successful submission
      await dispatch(getReviews(productId));
      
      setRating(0);
      setReviewMsg("");
      toast({
        title: "Review submitted!",
      });
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAIReviewSuggestions = async () => {
    if (!currentProduct) return;
    
    setShowAIHelp(true);
    
    try {
      const response = await fetch('/api/review-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product: currentProduct,
          userRating: rating 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
          toast({
            title: "💡 AI Review Tips",
            description: data.suggestions[0],
          });
        }
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRatingComponent 
                  rating={averageRating} 
                  readOnly 
                  size="w-5 h-5"
                />
                <span className="font-medium">
                  {averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-muted-foreground">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={setRating}
                size="w-6 h-6"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <Label>Review</Label>
              {rating > 0 && currentProduct && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={getAIReviewSuggestions}
                  className="text-xs"
                >
                  ✨ Get AI writing tips
                </Button>
              )}
            </div>
            <Input
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Help other customers by sharing your experience
            </p>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!reviewMsg.trim() || rating === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>

      {/* Review List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && reviews.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {review.userName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{review.userName || "Anonymous"}</p>
                        <div className="flex items-center gap-2">
                          <StarRatingComponent 
                            rating={review.reviewValue} 
                            readOnly 
                            size="w-4 h-4"
                          />
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        {review.reviewMessage || "No review text provided"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI-Powered Components */}
      <ReviewAnalysis reviews={reviews} />
      <AIRecommendations currentProduct={currentProduct} />
    </div>
  );
}