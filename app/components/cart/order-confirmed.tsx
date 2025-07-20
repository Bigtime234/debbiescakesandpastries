"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/client-store"
import Lottie from "lottie-react"
import { motion } from "framer-motion"
import orderConfirmed from "@/public/order-confirmed.json"

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore()
  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:p-6 max-w-md mx-auto">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie className="h-56 my-4" animationData={orderConfirmed} />
      </motion.div>
      
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-center leading-tight px-2">
        Thank you for your purchase! Your payment is being reviewed
      </h2>
      
      <div className="w-full mt-6">
        <Link href={"/dashboard/orders"} className="block w-full">
          <Button
            onClick={() => {
              setCheckoutProgress("cart-page")
              setCartOpen(false)
            }}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View Your Order
          </Button>
        </Link>
      </div>
    </div>
  )
}