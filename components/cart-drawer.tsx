"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatPrice } from "@/lib/utils"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Input } from "@/components/ui/input"

export function CartDrawer() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const { isAuthenticated } = useUser()
  const cartRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isCartOpen && cartRef.current && overlayRef.current) {
      // Animate overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })

      // Animate cart drawer
      gsap.fromTo(cartRef.current, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" })

      // Animate cart items
      gsap.fromTo(
        ".cart-item",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, delay: 0.2, ease: "power3.out" },
      )
    }
  }, [isCartOpen])

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartOpen])

  // Close cart with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isCartOpen) {
        closeCart()
      }
    }

    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isCartOpen])

  const closeCart = () => {
    if (cartRef.current && overlayRef.current) {
      // Animate overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })

      // Animate cart drawer
      gsap.to(cartRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setIsCartOpen(false),
      })
    }
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div ref={overlayRef} className="fixed inset-0 bg-background/80 backdrop-blur-sm opacity-0" />

      {/* Cart drawer */}
      <div
        ref={cartRef}
        className="fixed right-0 top-0 h-full w-full max-w-md border-l border-border/50 bg-card shadow-xl"
        style={{ transform: "translateX(100%)" }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 p-4">
            <h2 className="font-gaming text-xl text-primary">YOUR CART</h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Cart content */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 font-gaming text-xl">Your cart is empty</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button className="gaming-button" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item gaming-card flex items-center gap-4 p-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image || `/placeholder.svg?height=64&width=64`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-1 text-sm font-medium">{item.name}</h3>
                        <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-border/50"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease</span>
                        </Button>

                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value)
                            if (!isNaN(val)) {
                              updateQuantity(item.id, val)
                            }
                          }}
                          className="w-12 h-7 px-1 text-center text-sm border-border/50"
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-border/50"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (window.confirm("Remove this item from your cart?")) {
                            removeItem(item.id)
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border/50 p-4">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mb-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your cart?")) {
                      clearCart()
                    }
                  }}
                >
                  Clear Cart
                </Button>

                <div className="space-y-2">
                  <Link href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"} className="w-full">
                    <Button className="gaming-button w-full">Proceed to Checkout</Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

