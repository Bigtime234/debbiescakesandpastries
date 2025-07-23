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

// Revalidate every 60 seconds
export const revalidate = 60

// ✅ Required by Next.js for dynamic static pages
export async function generateStaticParams(): Promise<
  { slug: string }[]
> {
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
}

// ✅ Updated Page component with Promise<{ slug: string }> params type
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // ✅ Await the params Promise to get the actual values
  const { slug } = await params
  
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
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
  
  // If not found, return null or a fallback
  if (!variant) return null
  
  const reviewAvg = getReviewAverage(
    variant.product.reviews.map((r) => r.rating)
  )
  
  return (
    <main>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="flex-1">
          <ProductShowcase variants={variant.product.productVariants} />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-bold">{variant.product.title}</h2>
          <div>
            <ProductType variants={variant.product.productVariants} />
          </div>
          <Separator className="my-2" />
          <p className="text-2xl font-medium py-2">
            {formatPrice(variant.product.price)}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.product.description }}
          />
          <p className="text-secondary-foreground font-medium my-2">
            Available Colors
          </p>
          <div className="flex gap-4">
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
          <AddCart />
        </div>
      </section>
      <Reviews productID={variant.productID} />
    </main>
  )
}