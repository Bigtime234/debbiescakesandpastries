"use client"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VariantsWithImagesTags } from "@/lib/infer-types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// ✅ Explicitly declare prop type
interface ProductShowcaseProps {
  variants: VariantsWithImagesTags[]
}

export default function ProductShowcase({ variants }: ProductShowcaseProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])
  const searchParams = useSearchParams()
  const selectedColor = searchParams.get("type") || variants[0].productType

  const updatePreview = (index: number) => {
    api?.scrollTo(index)
  }

  useEffect(() => {
    if (!api) return
    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  return (
    <div className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="w-full">
          {variants
            .filter((variant) => variant.productType === selectedColor)
            .flatMap((variant) =>
              variant.variantImages.map((img) => (
                <CarouselItem key={img.url} className="w-full">
                  <div className="relative w-full aspect-square overflow-hidden rounded-md bg-gray-50">
                    <Image
                      priority
                      className="object-contain w-full h-full"
                      fill
                      sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 512px, (max-width: 1280px) 576px, 672px"
                      src={img.url}
                      alt={img.name}
                    />
                  </div>
                </CarouselItem>
              ))
            )}
        </CarouselContent>
        
        {/* Navigation arrows - hide on very small screens */}
        <CarouselPrevious className="hidden sm:flex -left-2 lg:-left-4" />
        <CarouselNext className="hidden sm:flex -right-2 lg:-right-4" />
      </Carousel>
      
      {/* Thumbnails */}
      <div className="flex overflow-x-auto py-2 gap-2 sm:gap-4 mt-4">
        {variants
          .filter((variant) => variant.productType === selectedColor)
          .flatMap((variant) =>
            variant.variantImages.map((img, index) => (
              <div 
                key={img.url} 
                className="flex-shrink-0"
              >
                <div className="relative w-12 h-9 sm:w-14 sm:h-11 lg:w-16 lg:h-12 overflow-hidden rounded-md bg-gray-50">
                  <Image
                    onClick={() => updatePreview(index)}
                    priority
                    className={cn(
                      index === activeThumbnail[0]
                        ? "opacity-100 ring-2 ring-primary"
                        : "opacity-75 hover:opacity-100",
                      "object-contain w-full h-full transition-all duration-300 ease-in-out cursor-pointer rounded-md"
                    )}
                    fill
                    sizes="64px"
                    src={img.url}
                    alt={img.name}
                  />
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  )
}