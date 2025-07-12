"use client"

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table"
import { useCartStore } from "@/lib/client-store"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo } from "react"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { MinusCircle, PlusCircle } from "lucide-react"
import { createId } from "@paralleldrive/cuid2"
import { Button } from "@/components/ui/button"
import Lottie from "lottie-react"
import emptycart from "@/public/empty-box.json"

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity
    }, 0)
  }, [cart])

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() }
    })
  }, [totalPrice])

  return (
    <motion.div className="flex flex-col items-center bg-[#F7F4E9]">
      {cart.length === 0 && (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your cart is empty
            </h2>
            <Lottie className="h-64" animationData={emptycart}  />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="max-h-80 w-full overflow-y-auto">
          {/* Mobile view - Hidden on desktop */}
          <div className="block md:hidden space-y-4">
            {cart.map((item, index) => (
              <motion.div 
                key={(item.id + item.variant.variantID).toString()} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 shadow-lg"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        className="rounded-xl flex-shrink-0 shadow-md"
                        width={70}
                        height={70}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.variant.quantity}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-1 truncate">{item.name}</h3>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-semibold rounded-full shadow-sm">
                        {formatPrice(item.price)}
                      </div>
                      
                      {/* Quantity controls for mobile */}
                      <div className="flex items-center gap-4 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            removeFromCart({
                              ...item,
                              variant: {
                                quantity: 1,
                                variantID: item.variant.variantID,
                              },
                            })
                          }}
                          className="p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-lg transition-all duration-200 border-2 border-white"
                        >
                          <MinusCircle className="text-white drop-shadow-lg" size={22} strokeWidth={2.5} />
                        </motion.button>
                        
                        <div className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold rounded-full shadow-md min-w-[60px] text-center">
                          {item.variant.quantity}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            addToCart({
                              ...item,
                              variant: {
                                quantity: 1,
                                variantID: item.variant.variantID,
                              },
                            })
                          }}
                          className="p-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg transition-all duration-200 border-2 border-white"
                        >
                          <PlusCircle className="text-white drop-shadow-lg" size={22} strokeWidth={2.5} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop table view - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 backdrop-blur-sm">
                <Table className="max-w-2xl mx-auto">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="font-bold text-gray-800 dark:text-white">Product</TableCell>
                      <TableCell className="font-bold text-gray-800 dark:text-white">Price</TableCell>
                      <TableCell className="font-bold text-gray-800 dark:text-white">Image</TableCell>
                      <TableCell className="font-bold text-gray-800 dark:text-white">Quantity</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item, index) => (
                      <motion.tr 
                        key={(item.id + item.variant.variantID).toString()}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-white">{item.name}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-semibold rounded-full">
                            {formatPrice(item.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <Image
                              className="rounded-xl shadow-md"
                              width={48}
                              height={48}
                              src={item.image}
                              alt={item.name}
                              priority
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{item.variant.quantity}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                removeFromCart({
                                  ...item,
                                  variant: {
                                    quantity: 1,
                                    variantID: item.variant.variantID,
                                  },
                                })
                              }}
                              className="p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-md transition-all duration-200 border-2 border-white"
                            >
                              <MinusCircle className="text-white drop-shadow-lg" size={18} strokeWidth={2.5} />
                            </motion.button>
                            
                            <div className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold rounded-full shadow-md min-w-[50px] text-center">
                              {item.variant.quantity}
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                addToCart({
                                  ...item,
                                  variant: {
                                    quantity: 1,
                                    variantID: item.variant.variantID,
                                  },
                                })
                              }}
                              className="p-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-md transition-all duration-200 border-2 border-white"
                            >
                              <PlusCircle className="text-white drop-shadow-lg" size={18} strokeWidth={2.5} />
                            </motion.button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Colorful total section */}
      <motion.div className="flex items-center justify-center relative my-6 overflow-hidden">
        <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>Total: #</span>
            <AnimatePresence mode="popLayout">
              {priceInLetters.map((letter, i) => (
                <motion.div key={letter.id}>
                  <motion.span
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{ delay: i * 0.1 }}
                    className="inline-block"
                  >
                    {letter.letter}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Colorful checkout button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={() => {
            setCheckoutProgress("payment-page")
          }}
          className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 border-0"
          disabled={cart.length === 0}
        >
          🛒 Checkout Now! 🎉
        </Button>
      </motion.div>
    </motion.div>
  )
}