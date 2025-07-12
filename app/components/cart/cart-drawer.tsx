"use client"
import { useCartStore } from "@/lib/client-store"
import { ShoppingBag } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AnimatePresence, motion } from "framer-motion"
import CartItems from "./cart-items"
import CartMessage from "./cart-message"
import Payment from "./payment"
import OrderConfirmed from "./order-confirmed"

export default function cartDrawer () {
    const {cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen} = useCartStore()
    return (
        <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[75vh]">
         <DrawerHeader>
          <CartMessage />
         
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}