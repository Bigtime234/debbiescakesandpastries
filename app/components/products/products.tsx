"use client"
import { VariantsWithProduct } from "@/lib/infer-types"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import formatPrice from "@/lib/format-price"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

type ProductTypes = {
  variants: VariantsWithProduct[]
}

export default function Products({ variants }: ProductTypes) {
  const params = useSearchParams()
  const paramTag = params.get("tag")
  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      )
    }
    return variants
  }, [paramTag])
  
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      {/* Container with proper padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Responsive grid with impressive spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {filtered.map((variant) => (
            <Link
              key={variant.id}
              href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
              className="group block w-full"
            >
              {/* Impressive Modern Card Design */}
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden h-full group-hover:-translate-y-3 transform border-0 backdrop-blur-sm">
                
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-teal-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                
                {/* Image container with stunning effects */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
                  <Image
                    className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                    src={variant.variantImages[0].url}
                    fill
                    alt={variant.product.title}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  
                  {/* Glossy overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/10 opacity-60"></div>
                  
                  {/* Floating price tag - stunning design */}
                  <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg backdrop-blur-sm">
                      <span className="text-xs md:text-sm lg:text-base font-bold tracking-wide">
                        {formatPrice(variant.product.price)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Premium content section */}
                <div className="p-5 md:p-6 lg:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30">
                  <div className="space-y-3">
                    <h2 className="font-bold text-base md:text-lg lg:text-xl text-slate-800 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-500">
                      {variant.product.title}
                    </h2>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs md:text-sm text-slate-600 uppercase font-semibold tracking-wider">
                        {variant.productType}
                      </p>
                    </div>
                  </div>
                  
                  {/* Modern action indicator */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs md:text-sm text-slate-500 font-medium">
                      View Details
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full group-hover:animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full group-hover:animate-bounce" style={{ animationDelay: '100ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-green-500 rounded-full group-hover:animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-purple-500/5 pointer-events-none group-hover:to-purple-500/10 transition-all duration-700"></div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {paramTag 
                ? `No products found for "${paramTag}" category.` 
                : "No products available at the moment."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}