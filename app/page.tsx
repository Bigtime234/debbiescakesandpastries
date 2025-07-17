// Make sure the path matches the actual file location and casing
import Products from "@/app/components/products/products"
import { db } from "@/server"
import ProductTags from "@/app/components/products/product-tags"
import HeroSection from "@/app/components/hero-section";








export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })







 return (
   <main className="w-full">

  <HeroSection />
  <ProductTags />
  <Products variants={data} />
</main>
 )

}
