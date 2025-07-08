"use client"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { useState } from "react"

export default function Stars({
  rating,
  totalReviews,
  size = 14,
  interactive = false,
  onRatingChange,
}: {
  rating: number
  totalReviews?: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(rating)

  const handleStarClick = (starValue: number) => {
    if (!interactive) return
    
    setSelectedRating(starValue)
    onRatingChange?.(starValue)
  }

  const handleStarHover = (starValue: number) => {
    if (!interactive) return
    setHoveredRating(starValue)
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setHoveredRating(0)
  }

  const displayRating = interactive ? (hoveredRating || selectedRating) : rating

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "text-primary bg-transparent transition-all duration-300 ease-in-out",
            displayRating >= star ? "fill-primary" : "fill-transparent",
            interactive && "cursor-pointer hover:scale-110"
          )}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {totalReviews ? (
        <span className="text-secondary-foreground font-bold text-sm ml-2">
          {totalReviews} reviews
        </span>
      ) : null}
    </div>
  )
}