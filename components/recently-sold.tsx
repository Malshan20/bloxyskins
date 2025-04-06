"use client"

import { useRef } from "react"
import Image from "next/image"
import { useMarketplace } from "./marketplace-provider"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function RecentlySold() {
  const { recentlySold } = useMarketplace()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  if (recentlySold.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="recently-sold-title font-gaming text-2xl text-primary">RECENTLY SOLD</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {recentlySold.map((item, index) => (
          <Card
            key={`${item.id}-${index}`}
            className="recently-sold-item gaming-card min-w-[200px] flex-shrink-0 overflow-hidden border-border/50"
          >
            <CardContent className="p-3">
              <div className="relative aspect-square overflow-hidden rounded">
                <Image
                  src={item.image || `/placeholder.svg?height=100&width=100`}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="line-clamp-1 text-sm font-medium">{item.name}</h3>
                <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
