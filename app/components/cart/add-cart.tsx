"use client"
import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { redirect, useSearchParams } from "next/navigation"

interface AddCartProps {
  variant?: {
    id: number;
    productID: number;
    productType: string;
    color: string;
    product: {
      id: number;
      title: string;
      price: number;
      description: string;
      productVariants: Array<{
        variantImages: Array<{
          url: string;
        }>;
      }>;
    };
  };
  fallbackData?: {
    id: number;
    productID: number;
    title: string;
    type: string;
    price: number;
    image: string;
  };
}

export default function AddCart({ variant, fallbackData }: AddCartProps) {
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const params = useSearchParams()
  
  // Try to get data from URL params first (existing functionality)
  const urlId = Number(params.get("id"))
  const urlProductID = Number(params.get("productID"))
  const urlTitle = params.get("title")
  const urlType = params.get("type")
  const urlPrice = Number(params.get("price"))
  const urlImage = params.get("image")
  
  // Determine which data source to use
  let productData: any = null;
  
  if (urlId && urlProductID && urlTitle && urlType && urlPrice && urlImage) {
    // Use URL params (existing functionality)
    productData = {
      id: urlId,
      productID: urlProductID,
      title: urlTitle,
      type: urlType,
      price: urlPrice,
      image: urlImage
    };
  } else if (variant) {
    // Use variant prop data
    productData = {
      id: variant.id,
      productID: variant.product.id,
      title: variant.product.title,
      type: variant.productType,
      price: variant.product.price,
      image: variant.product.productVariants?.[0]?.variantImages?.[0]?.url || '/placeholder.jpg'
    };
  } else if (fallbackData) {
    // Use fallback data
    productData = fallbackData;
  }
  
  // If no valid data found, show error
  if (!productData) {
    toast.error("Product not found")
    return redirect("/")
  }
  
  const handleAddToCart = () => {
    toast.success(`Added ${productData.title} ${productData.type} to your cart!`)
    addToCart({
      id: productData.productID,
      variant: { variantID: productData.id, quantity },
      name: `${productData.title} ${productData.type}`,
      price: productData.price,
      image: productData.image,
    })
  }
  
  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1)
            }
          }}
          variant="secondary"
          className="text-primary"
          disabled={quantity <= 1}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant="secondary" className="flex-1">
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1)
          }}
          variant="secondary"
          className="text-primary"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button onClick={handleAddToCart} className="w-full">
        Add to cart
      </Button>
    </>
  )
}