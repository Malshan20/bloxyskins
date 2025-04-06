"use client"

import { useRef } from "react"
import Image from "next/image"
import { useMarketplace, type GameCategory } from "./marketplace-provider"

const gameImages: Record<string, string> = {
  Limiteds: "/games/limited.svg",
  CS2: "/games/cs2.svg",
  "Dota 2": "/games/dota2.svg",
  Rust: "/games/rust.svg",
  "In Game": "/games/in-game.svg",
}

export function GameCategories() {
  const { selectedCategory, setSelectedCategory } = useMarketplace()
  const containerRef = useRef<HTMLDivElement>(null)

  const categories: GameCategory[] = ["Limiteds", "CS2", "Dota 2", "Rust", "In Game"]

  return (
    <div ref={containerRef} className="flex justify-center space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`game-category relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-300 ${
            selectedCategory === category
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "opacity-80 hover:opacity-100"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          <div className="relative h-16 w-24 overflow-hidden rounded-md">
            <Image
              src={gameImages[category] || `/placeholder.svg?height=64&width=96`}
              alt={category}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {category}
          </span>
        </button>
      ))}
    </div>
  )
}
