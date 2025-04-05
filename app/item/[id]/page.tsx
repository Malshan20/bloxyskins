"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { marketItems } from "@/data/market-items"
import type { MarketItem } from "@/components/marketplace-provider"
import { formatPrice, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Share2, ArrowLeft, Check } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function ItemPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<MarketItem | null>(null)
  const [relatedItems, setRelatedItems] = useState<MarketItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addItem, setIsCartOpen } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Find the item by ID
    const foundItem = marketItems.find((item) => item.id === id)
    setItem(foundItem || null)

    // Get related items (same category)
    if (foundItem) {
      const related = marketItems.filter((i) => i.category === foundItem.category && i.id !== foundItem.id).slice(0, 4)
      setRelatedItems(related)
    }

    setIsLoading(false)
  }, [id])

  const handleAddToCart = () => {
    if (!item) return

    setIsAddingToCart(true)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem(item, 1)
      setIsAddingToCart(false)
      setIsAddedToCart(true)

      // Reset the "Added" state after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false)
      }, 2000)
    }, 600)
  }

  const handleBuyNow = () => {
    if (!item) return

    setIsAddingToCart(true)

    // Add to cart then redirect to checkout
    setTimeout(() => {
      addItem(item, 1)
      setIsAddingToCart(false)
      router.push("/checkout")
    }, 600)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Item Not Found</h1>
        <p className="mt-4 text-muted-foreground">The item you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="mt-8">
          <Button className="gaming-button">Return to Marketplace</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div ref={itemRef} className="mx-auto max-w-6xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Item Image */}
          <div className="item-image gaming-card flex items-center justify-center p-8">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg">
              <Image
                src={item.image || `/placeholder.svg?height=400&width=400`}
                alt={item.name}
                width={400}
                height={400}
                className="h-full w-full object-contain"
              />
              {item.rarity && (
                <Badge
                  variant="outline"
                  className={`absolute right-2 top-2 border-none ${
                    item.rarity === "Common"
                      ? "bg-slate-500/80"
                      : item.rarity === "Uncommon"
                        ? "bg-green-500/80"
                        : item.rarity === "Rare"
                          ? "bg-blue-500/80"
                          : item.rarity === "Epic"
                            ? "bg-purple-500/80"
                            : "bg-orange-500/80"
                  } text-white backdrop-blur-sm`}
                >
                  {item.rarity}
                </Badge>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="item-details space-y-6">
            <div>
              <h1 className="font-gaming text-3xl font-bold">{item.name}</h1>
              <p className="mt-2 text-muted-foreground">Category: {item.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="gaming-card">
                <p className="text-sm text-muted-foreground">RAP</p>
                <p className="text-xl font-bold">{formatNumber(item.rap)}</p>
              </div>
              <div className="gaming-card">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-xl font-bold text-primary">{formatPrice(item.price)}</p>
              </div>
            </div>

            <div className="item-actions flex flex-wrap gap-4">
              <Button className="gaming-button flex-1" onClick={handleBuyNow} disabled={isAddingToCart}>
                {isAddingToCart ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                onClick={handleAddToCart}
                disabled={isAddingToCart || isAddedToCart}
              >
                {isAddingToCart ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                    Adding...
                  </>
                ) : isAddedToCart ? (
                  <>
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mr-2">
                      <Check className="h-4 w-4" />
                    </motion.div>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="description" className="item-tabs w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="gaming-card mt-4">
                <div className="space-y-4">
                  <p>
                    {item.name} is a {item.rarity?.toLowerCase()} item from the {item.category} category. This item is
                    highly sought after by collectors and gamers alike.
                  </p>
                  <p>
                    With a Recent Average Price (RAP) of {formatNumber(item.rap)}, this item has proven to be a valuable
                    asset in the gaming community.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details" className="gaming-card mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Item ID</p>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rarity</p>
                      <p className="font-medium">{item.rarity || "Standard"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Limited Edition</p>
                      <p className="font-medium">{item.featured ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="gaming-card mt-4">
                <div className="space-y-4">
                  <p>Price History (Last 30 Days)</p>
                  <div className="h-40 w-full rounded-md bg-background/50 p-4">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">Price history chart will be displayed here</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This item has been traded {Math.floor(item.rap / item.price)} times in the last 30 days.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="related-title mb-6 font-gaming text-2xl font-bold text-primary">Related Items</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedItems.map((relatedItem, index) => (
                <Link key={relatedItem.id} href={`/item/${relatedItem.id}`} className="related-item gaming-card group">
                  <div className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={relatedItem.image || `/placeholder.svg?height=200&width=200` || "/placeholder.svg"}
                      alt={relatedItem.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="line-clamp-1 text-sm font-medium">{relatedItem.name}</h3>
                    <p className="text-sm font-bold text-primary">{formatPrice(relatedItem.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
