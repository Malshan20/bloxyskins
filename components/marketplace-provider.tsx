"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { marketItems } from "@/data/market-items"

export type PaymentMethod = "All" | "Paypal" | "Card"
export type SortOption =
  | "Rap (High to Low)"
  | "Rap (Low to High)"
  | "Price (High to Low)"
  | "Price (Low to High)"
  | "Rate (Low to High)"

export type GameCategory = "All" | "Limiteds" | "CS2" | "Dota 2" | "Rust" | "In Game"

export type MarketItem = {
  id: string
  name: string
  image: string
  category: GameCategory
  rap: number
  price: number
  rarity?: string
  featured?: boolean
  new?: boolean
}

interface MarketplaceContextType {
  items: MarketItem[]
  filteredItems: MarketItem[]
  recentlySold: MarketItem[]
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  minPrice: number
  maxPrice: number
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: GameCategory
  setSelectedCategory: (category: GameCategory) => void
  resetFilters: () => void
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [items] = useState<MarketItem[]>(marketItems)
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>(marketItems)
  const [recentlySold, setRecentlySold] = useState<MarketItem[]>([])

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(20000)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("All")
  const [sortOption, setSortOption] = useState<SortOption>("Rap (High to Low)")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("All")

  // Initialize recently sold items
  useEffect(() => {
    // Get 6 random items for recently sold
    const randomItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 6)

    setRecentlySold(randomItems)
  }, [items])

  // Apply filters
  useEffect(() => {
    let result = [...items]

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Apply price range filter
    result = result.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1])

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) => item.name.toLowerCase().includes(query))
    }

    // Apply sorting
    result = sortItems(result, sortOption)

    setFilteredItems(result)
  }, [items, priceRange, paymentMethod, sortOption, searchQuery, selectedCategory])

  // Find min and max prices in the dataset
  useEffect(() => {
    if (items.length > 0) {
      const prices = items.map((item) => item.price)
      setMinPrice(Math.min(...prices))
      setMaxPrice(Math.max(...prices))
      setPriceRange([Math.min(...prices), Math.max(...prices)])
    }
  }, [items])

  const sortItems = (items: MarketItem[], option: SortOption): MarketItem[] => {
    const sorted = [...items]

    switch (option) {
      case "Rap (High to Low)":
        return sorted.sort((a, b) => b.rap - a.rap)
      case "Rap (Low to High)":
        return sorted.sort((a, b) => a.rap - b.rap)
      case "Price (High to Low)":
        return sorted.sort((a, b) => b.price - a.price)
      case "Price (Low to High)":
        return sorted.sort((a, b) => a.price - b.price)
      case "Rate (Low to High)":
        // This is a placeholder for a rate calculation
        // In a real app, you might have a rate property or calculate it
        return sorted.sort((a, b) => a.rap / a.price - b.rap / b.price)
      default:
        return sorted
    }
  }

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setPaymentMethod("All")
    setSortOption("Rap (High to Low)")
    setSearchQuery("")
    setSelectedCategory("All")
  }

  return (
    <MarketplaceContext.Provider
      value={{
        items,
        filteredItems,
        recentlySold,
        priceRange,
        setPriceRange,
        minPrice,
        maxPrice,
        paymentMethod,
        setPaymentMethod,
        sortOption,
        setSortOption,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        resetFilters,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider")
  }
  return context
}

