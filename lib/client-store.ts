import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Variant = {
  variantID: number
  quantity: number
}

// Add customization type for cake orders
export type CakeCustomization = {
  size: string
  layers: string
  flavour: string
  upgrade: string
  toppings: string[]
  addOns: string[]
  message: string
  basePrice: number
  totalPrice: number
}

export type CartItem = {
  name: string
  image: string
  id: number
  variant: Variant
  price: number
  // Add optional customization property for cakes
  customization?: CakeCustomization
}

export type CartState = {
  cart: CartItem[]
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page"
  setCheckoutProgress: (
    val: "cart-page" | "payment-page" | "confirmation-page"
  ) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      setCartOpen: (val) => set({ cartOpen: val }),
      clearCart: () => set({ cart: [] }),
      checkoutProgress: "cart-page",
      setCheckoutProgress: (val) => set((state) => ({ checkoutProgress: val })),
      addToCart: (item) =>
        set((state) => {
          // For customized cakes, treat each customization as a unique item
          // This prevents combining different cake customizations
          const isCustomizedCake = item.customization !== undefined;
          
          let existingItem;
          if (isCustomizedCake) {
            // For customized cakes, don't combine with existing items
            // Each customization should be a separate cart item
            existingItem = null;
          } else {
            // For regular products, find existing item by variantID
            existingItem = state.cart.find(
              (cartItem) => cartItem.variant.variantID === item.variant.variantID && !cartItem.customization
            );
          }
          
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantID === item.variant.variantID && !cartItem.customization) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                }
              }
              return cartItem
            })
            return { cart: updatedCart }
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                  // Preserve customization data if it exists
                  ...(item.customization && { customization: item.customization })
                },
              ],
            }
          }
        }),
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            // Match by variantID and customization presence for proper removal
            const isMatchingItem = cartItem.variant.variantID === item.variant.variantID;
            const isSameCustomization = 
              (cartItem.customization === undefined && item.customization === undefined) ||
              (cartItem.customization !== undefined && item.customization !== undefined);
              
            if (isMatchingItem && isSameCustomization) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              }
            }
            return cartItem
          })
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          }
        }),
    }),
    { name: "cart-storage" }
  )
)