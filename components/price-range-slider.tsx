"use client"

import { useState, useEffect } from "react"
import * as Slider from "@radix-ui/react-slider"
import { useMarketplace } from "./marketplace-provider"
import { formatPrice } from "@/lib/utils"

export function PriceRangeSlider() {
  const { minPrice, maxPrice, priceRange, setPriceRange } = useMarketplace()
  const [localRange, setLocalRange] = useState(priceRange)

  useEffect(() => {
    setLocalRange(priceRange)
  }, [priceRange])

  const handleChange = (value: number[]) => {
    setLocalRange([value[0], value[1]])
  }

  const handleCommit = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{formatPrice(localRange[0])}</div>
        <div className="text-sm font-medium text-muted-foreground">{formatPrice(localRange[1])}</div>
      </div>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={localRange}
        min={minPrice}
        max={maxPrice}
        step={1}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
      >
        <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
          <Slider.Range className="absolute h-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-primary/10"
          aria-label="Min price"
        />
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-primary/10"
          aria-label="Max price"
        />
      </Slider.Root>
    </div>
  )
}

