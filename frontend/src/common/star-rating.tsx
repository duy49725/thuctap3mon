import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({rating, handleRatingChange}: {rating: number, handleRatingChange?: (star: number) => void}) => {
    return [1,2,3,4,5].map((star) => (
        <button
            className={`p-2 rounded-none border-none outline-none transition-colors ${
                star <= rating
                    ? "text-yellow-500"
                    : "text-black"
            }`}
            onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
        >
            <StarIcon 
                 className={`w-6 h-6 ${
                    star <= rating ? "fill-yellow-500" : "fill-black"
                }`}
            />
        </button>
    ))
}

export default StarRatingComponent;