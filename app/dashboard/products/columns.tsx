"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useAction } from "next-safe-action/hooks"
import { deleteProduct } from "@/lib/actions/delete-product"    
import { toast } from "sonner"
import Link from "next/link"
import { VariantsWithImagesTags } from "@/lib/infer-types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProductVariant } from "./product-variant"
import { useRouter } from "next/navigation"

type ProductColumn = {
  title: string
  price: number
  image: string
  variants: VariantsWithImagesTags[]
  id: number
}

// Type for the action result
type ActionResult = {
  data?: {
    error?: string
    success?: string
  }
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const router = useRouter()
  
  const { status, execute } = useAction(deleteProduct, {
    onSuccess: (data: ActionResult) => {
      // Dismiss the loading toast
      toast.dismiss()
      
      if (data?.data?.error) {
        toast.error(data.data.error)
      }
      if (data?.data?.success) {
        toast.success(data.data.success)
        // Refresh the page data to reflect the deletion
        router.refresh()
      }
    },
    onExecute: () => {
      toast.loading("Deleting Product...", {
        id: "delete-product", // Give the toast an ID so we can dismiss it later
      })
    },
    onError: (error) => {
      // Dismiss the loading toast
      toast.dismiss("delete-product")
      toast.error("Failed to delete product")
      console.error("Delete error:", error)
    },
  })
  
  const product = row.original

  const handleDelete = () => {
    try {
      execute({ id: product.id })
    } catch (error) {
      toast.dismiss("delete-product")
      toast.error("Failed to delete product")
      console.error("Delete error:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
          disabled={status === "executing"} // Disable button while deleting
        >
          {status === "executing" ? "Deleting..." : "Delete Product"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[]
      
      // Debug log to see what data we're getting
      console.log("Variants data for product", row.original.id, ":", variants)
      
      // More robust safety check for variants
      const hasVariants = variants && Array.isArray(variants) && variants.length > 0
      
      return (
        <div className="flex gap-2 items-center">
          {hasVariants ? (
            variants.map((variant: VariantsWithImagesTags) => (
              <div key={variant.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ProductVariant
                        productID={variant.productID}
                        variant={variant}
                        editMode={true}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"
                          style={{ background: variant.color || '#000000' }}
                        />
                      </ProductVariant>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{variant.productType || 'Unknown Type'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-xs">No variants</div>
          )}
          
          {/* Add New Variant Button - Always show */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ProductVariant productID={row.original.id} editMode={false}>
                  <div className="cursor-pointer inline-flex items-center justify-center">
                    <PlusCircle className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                  </div>
                </ProductVariant>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new product variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const priceValue = row.getValue("price")
      const price = typeof priceValue === 'string' ? parseFloat(priceValue) : (priceValue as number)
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "NGN",
        style: "currency",
      }).format(isNaN(price) ? 0 : price)
      return <div className="font-medium text-xs">{formatted}</div>
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string
      const cellTitle = row.getValue("title") as string
      
      if (!cellImage) {
        return (
          <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )
      }
      
      return (
        <div className="">
          <Image
            src={cellImage}
            alt={cellTitle || 'Product image'}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionCell,
  },
]   