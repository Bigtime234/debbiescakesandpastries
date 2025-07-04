import { db } from "@/server"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import placeholder from "@/public/placeholder_small(1).jpg"

export default async function Products() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  })
 
  if (!products) throw new Error("No products found")
 
  const dataTable = products.map((product) => {
    // Check if variant images exist, fallback to placeholder
    const image = product.productVariants?.[0]?.variantImages?.[0]?.url || placeholder.src
    
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    }
  })
 
  if (!dataTable.length) throw new Error("No data found")
 
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  )
}