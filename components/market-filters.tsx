"use client"

import { useMarketplace, type PaymentMethod, type SortOption, type GameCategory } from "./marketplace-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PriceRangeSlider } from "./price-range-slider"
import { Search, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export function MarketFilters() {
  const {
    paymentMethod,
    setPaymentMethod,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
  } = useMarketplace()

  const filtersRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (filtersRef.current) {
      gsap.from(".filter-section", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [])

  const gameCategories: GameCategory[] = ["All", "Limiteds", "CS2", "Dota 2", "Rust", "In Game"]

  return (
    <div ref={filtersRef} className="space-y-6">
      <div className="filter-section">
        <h3 className="mb-2 text-lg font-gaming text-primary">Game</h3>
        <div className="space-y-1">
          {gameCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className={`w-full justify-start px-2 ${
                selectedCategory === category
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="mb-2 text-lg font-gaming text-primary">Filters</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Search items..."
                className="pl-8 bg-background border-border/50 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Price</Label>
            <PriceRangeSlider />
          </div>

          <div>
            <Label className="text-sm font-medium">Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="mt-2 space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="all" className="border-primary text-primary" />
                <Label htmlFor="all" className="text-sm cursor-pointer">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Paypal" id="paypal" className="border-primary text-primary" />
                <Label htmlFor="paypal" className="text-sm cursor-pointer">
                  Paypal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Card" id="card" className="border-primary text-primary" />
                <Label htmlFor="card" className="text-sm cursor-pointer">
                  Card
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium">Sort</Label>
            <RadioGroup
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
              className="mt-2 space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rap (High to Low)" id="rap-high" className="border-primary text-primary" />
                <Label htmlFor="rap-high" className="text-sm cursor-pointer">
                  Rap (High to Low)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rap (Low to High)" id="rap-low" className="border-primary text-primary" />
                <Label htmlFor="rap-low" className="text-sm cursor-pointer">
                  Rap (Low to High)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Price (High to Low)" id="price-high" className="border-primary text-primary" />
                <Label htmlFor="price-high" className="text-sm cursor-pointer">
                  Price (High to Low)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Price (Low to High)" id="price-low" className="border-primary text-primary" />
                <Label htmlFor="price-low" className="text-sm cursor-pointer">
                  Price (Low to High)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rate (Low to High)" id="rate-low" className="border-primary text-primary" />
                <Label htmlFor="rate-low" className="text-sm cursor-pointer">
                  Rate (Low to High)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <motion.div className="filter-section" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="w-full border-primary/50 text-primary hover:bg-primary/10"
          onClick={resetFilters}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </motion.div>
    </div>
  )
}

