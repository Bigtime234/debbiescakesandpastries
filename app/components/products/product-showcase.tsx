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
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants
          .filter((variant) => variant.productType === selectedColor)
          .flatMap((variant) =>
            variant.variantImages.map((img) => (
              <CarouselItem key={img.url}>
                <Image
                  priority
                  className="rounded-md"
                  width={1280}
                  height={720}
                  src={img.url}
                  alt={img.name}
                />
              </CarouselItem>
            ))
          )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants
          .filter((variant) => variant.productType === selectedColor)
          .flatMap((variant) =>
            variant.variantImages.map((img, index) => (
              <div key={img.url}>
                <Image
                  onClick={() => updatePreview(index)}
                  priority
                  className={cn(
                    index === activeThumbnail[0]
                      ? "opacity-100"
                      : "opacity-75",
                    "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                  )}
                  width={72}
                  height={48}
                  src={img.url}
                  alt={img.name}
                />
              </div>
            ))
          )}
      </div>
    </Carousel>
  )
}
