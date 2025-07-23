import ProductType from "@/app/components/products/product-type"
import { db } from "@/server"
import { productVariants } from "@/server/schema"
import { eq } from "drizzle-orm"
import { Separator } from "@/components/ui/separator"
import formatPrice from "@/lib/format-price"
import ProductPick from "@/app/components/products/product-pick"
import ProductShowcase from "@/app/components/products/product-showcase"
import Reviews from "@/app/components/reviews/reviews"
import { getReviewAverage } from "@/lib/review-avarage"
import AddCart from "@/app/components/cart/add-cart"
import { notFound } from "next/navigation"

// Revalidate every 60 seconds
export const revalidate = 60

// ✅ Required by Next.js for dynamic static pages
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const data = await db.query.productVariants.findMany({
      with: {
        variantImages: true,
        variantTags: true,
        product: true,
      },
      orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
    })
    return data.map((variant) => ({
      slug: variant.id.toString(),
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// ✅ Page component with correctly typed params
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Await params in Next.js 15
  const resolvedParams = await params
  
  try {
    const variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, Number(resolvedParams.slug)),
      with: {
        product: {
          with: {
            reviews: true,
            productVariants: {
              with: {
                variantImages: true,
                variantTags: true,
              },
            },
          },
        },
      },
    })
    
    // Use Next.js notFound() instead of returning null
    if (!variant) {
      notFound()
    }
    
    const reviewAvg = getReviewAverage(
      variant.product.reviews.map((r) => r.rating)
    )
    
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <section className="flex flex-col xl:flex-row gap-6 sm:gap-8 lg:gap-12">
          {/* Product Images - Now properly responsive */}
          <div className="w-full xl:w-1/2">
            <ProductShowcase variants={variant.product.productVariants} />
          </div>
          
          {/* Product Details - Takes full width on mobile, half on large screens */}
          <div className="w-full xl:w-1/2 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                {variant.product.title}
              </h2>
              <ProductType variants={variant.product.productVariants} />
            </div>
            
            <Separator className="my-3 sm:my-4" />
            
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-primary">
              {formatPrice(variant.product.price)}
            </p>
            
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            />
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-secondary-foreground font-medium text-sm sm:text-base">
                Available Colors
              </p>
              
              {/* Color variants with responsive grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
                {variant.product.productVariants.map((prodVariant) => (
                  <ProductPick
                    key={prodVariant.id}
                    productID={prodVariant.productID}
                    productType={prodVariant.productType}
                    id={prodVariant.id}
                    color={prodVariant.color}
                    price={variant.product.price}
                    title={variant.product.title}
                    image={prodVariant.variantImages?.[0]?.url}
                  />
                ))}
              </div>
            </div>
            
            <div className="pt-4 sm:pt-6 sticky bottom-4 sm:static sm:bottom-auto bg-background/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-4 sm:p-0 -mx-4 sm:mx-0 rounded-t-lg sm:rounded-none border-t sm:border-t-0">
              <AddCart />
            </div>
          </div>
        </section>
        
        {/* Reviews section with proper spacing */}
        <section className="mt-8 sm:mt-12 lg:mt-16">
          <Reviews productID={variant.productID} />
        </section>
      </main>
    )
  } catch (error) {
    console.error("Error loading product variant:", error)
    notFound()
  }
}