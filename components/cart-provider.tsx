"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { MarketItem } from "@/components/marketplace-provider"

export interface CartItem extends MarketItem {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: MarketItem, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("nexusgear-cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse stored cart:", error)
        localStorage.removeItem("nexusgear-cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nexusgear-cart", JSON.stringify(items))
  }, [items])

  // Calculate total item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Add item to cart
  const addItem = (item: MarketItem, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }]
      }
    })

    toast({
      title: "Item Added",
      description: `${item.name} has been added to your cart.`,
    })
  }

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    })
  }

  // Update item quantity with validation
  const updateQuantity = (itemId: string, quantity: number) => {
    // Validate quantity
    if (quantity < 1) {
      // Show confirmation before removing
      if (window.confirm("Remove this item from your cart?")) {
        removeItem(itemId)
      }
      return
    }

    // Limit maximum quantity to 99
    const validQuantity = Math.min(quantity, 99)

    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity: validQuantity } : item)))

    // Show toast for quantity update
    toast({
      title: "Quantity Updated",
      description: `Item quantity has been updated.`,
    })
  }

  // Clear cart with confirmation
  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

