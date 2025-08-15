import { Star } from "lucide-react";
import { Button } from "../ui/button";

export function StarRatingComponent({ 
  rating = 0, 
  handleRatingChange = () => {} 
}) {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}  // Essential for React lists
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-yellow-100"
          : "text-gray-400 hover:bg-gray-100"
      }`}
      variant="ghost"
      size="icon"
      onClick={() => handleRatingChange(star)}
      type="button"
    >
      <Star
        className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : "fill-transparent"
        }`}
        strokeWidth={1.5}
      />
    </Button>
  ));
}

export default StarRatingComponent;