"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StarRatingComponent from "@/components/common/star-rating.jsx";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, TrendingUp, Users, MessageSquare, Bot, Lightbulb } from "lucide-react";

// Smart AI Recommendations Component
const AIRecommendations = ({ currentProduct, reviews = [] }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smartMode, setSmartMode] = useState(true);

  useEffect(() => {
    if (currentProduct) {
      getAIRecommendations();
    }
  }, [currentProduct, smartMode]);

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
        body: JSON.stringify({ 
          product: currentProduct,
          action: "recommend",
          reviews: smartMode ? reviews.slice(0, 5) : [],
          context: {
            avgRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length : 0,
            reviewCount: reviews.length,
            smartMode
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
      console.error('AI Recommendations error:', err);
      
      setRecommendations([
        {
          _id: "fallback1",
          title: `Similar ${currentProduct.category} Item`,
          category: currentProduct.category,
          price: "KSH 99",
          imageUrl: "/placeholder-image.jpg",
          description: "High-quality alternative",
          reason: "Based on product category"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Unable to load recommendations at the moment.</p>
          <Button 
            variant="outline" 
            size="sm" 
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Bot className="w-5 h-5" />
          You might also like
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h4 className="font-medium text-sm mb-2 line-clamp-2">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mb-1">{rec.category}</p>
              <p className="text-sm font-bold text-primary mb-3">{rec.price}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
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
        date: r.createdAt,
        isVerified: r.isVerified
      }));

      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reviews: reviewTexts,
          action: "analyzeReviews"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({
          ...data.analysis,
          confidence: reviewTexts.length >= 10 ? "High" : reviewTexts.length >= 5 ? "Medium" : "Low",
          verifiedCount: reviewTexts.filter(r => r.isVerified).length,
          lastAnalyzed: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Review analysis error:', error);
      setAnalysis({
        overallSentiment: "Unable to analyze at this time",
        commonPraises: [],
        commonConcerns: [],
        confidence: "Low"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analysis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5" />
          Review Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysis.overallSentiment && (
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Overall Sentiment
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{analysis.overallSentiment}</p>
            </div>
          )}
          
          {analysis.commonPraises && analysis.commonPraises.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-green-600">Most Praised</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                {analysis.commonPraises.map((praise, idx) => (
                  <li key={idx}>{praise}</li>
                ))}
              </ul>
            </div>
          )}
          
          {analysis.commonConcerns && analysis.commonConcerns.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-orange-600">Common Concerns</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
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
  
  const { isLoading = false, reviews = [] } = useSelector(
    (state) => state.shopReview || {}
  );

  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [reviewQuality, setReviewQuality] = useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(getReviews(productId));
    }
  }, [dispatch, productId]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.reviewValue, 0) / reviews.length 
    : 0;

  const handleSubmit = async () => {
    if (!reviewMsg.trim() || rating === 0) return;

    try {
      setIsSubmitting(true);
      
      await dispatch(
        addReview({
          productId,
          userId: "guest",
          userName: currentUser?.userName || "Guest User",
          reviewMessage: reviewMsg,
          reviewValue: rating,
          isVerified: false,
        })
      ).unwrap();

      await dispatch(getReviews(productId));
      
      setRating(0);
      setReviewMsg("");
      toast({
        title: "Review submitted!",
        description: currentUser?.id ? "Thanks for your review!" : "Thank you for your feedback!"
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
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product: currentProduct,
          userRating: rating,
          action: "reviewSuggestions",
          existingReviews: reviews.slice(0, 3)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
          const suggestion = data.suggestions[Math.floor(Math.random() * data.suggestions.length)];
          toast({
            title: "AI Writing Helper",
            description: suggestion,
            duration: 6000,
          });
          
          if (!reviewMsg.trim() && rating > 0) {
            const starterText = rating >= 4 
              ? "I'm really happy with this purchase because " 
              : rating >= 3 
              ? "This product is decent, though " 
              : "I had some issues with this product - ";
            setReviewMsg(starterText);
          }
        }
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      toast({
        title: "Quick Tip",
        description: "Try mentioning the product quality, value for money, and your overall experience!",
        duration: 4000,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Statistics */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Review Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length > 0 ? (
                <>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                    <StarRatingComponent 
                      rating={averageRating} 
                      readOnly 
                      size="w-5 h-5"
                    />
                    <p className="text-muted-foreground">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.reviewValue === stars).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-3">{stars}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Write Review Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                Write a Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Your Rating</Label>
                <div className="flex gap-1 mt-2">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={setRating}
                    size="w-8 h-8"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base font-medium">Your Review</Label>
                  {rating > 0 && currentProduct && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={getAIReviewSuggestions}
                      className="text-sm flex items-center gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Get AI writing tips
                    </Button>
                  )}
                </div>
                <Input
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="min-h-[100px] resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Help other customers by sharing your experience with quality, value, and overall satisfaction.
                </p>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!reviewMsg.trim() || rating === 0 || isSubmitting}
                className="w-full py-3"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReviewAnalysis reviews={reviews} />
        <AIRecommendations currentProduct={currentProduct} reviews={reviews} />
      </div>

      {/* Customer Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5" />
            Customer Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && reviews.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No reviews yet</p>
              <p className="text-sm text-muted-foreground">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="p-6 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="text-lg font-medium">
                        {review.userName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-base">{review.userName || "Anonymous"}</p>
                          {review.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-3">
                        <StarRatingComponent 
                          rating={review.reviewValue} 
                          readOnly 
                          size="w-4 h-4"
                        />
                      </div>
                      <p className="text-sm leading-relaxed">
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
    </div>
  );
}