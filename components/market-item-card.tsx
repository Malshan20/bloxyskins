"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import type { MarketItem } from "./marketplace-provider"
import { formatPrice, formatNumber } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface MarketItemCardProps {
  item: MarketItem
  index: number
}

export function MarketItemCard({ item, index }: MarketItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: index * 0.05,
        ease: "power3.out",
      })
    }
  }, [index])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    })

    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="gaming-card group perspective"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-square overflow-hidden rounded-md">
        <Image
          src={item.image || `/placeholder.svg?height=200&width=200`}
          alt={item.name}
          width={200}
          height={200}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {item.featured && (
          <Badge variant="default" className="absolute left-2 top-2 bg-primary text-white">
            Featured
          </Badge>
        )}
        {item.new && (
          <Badge variant="default" className="absolute left-2 top-2 bg-green-500 text-white">
            New
          </Badge>
        )}
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
      <div className="mt-2 space-y-1">
        <h3 className="font-gaming text-sm text-foreground line-clamp-1">{item.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">RAP</p>
            <p className="text-sm font-medium">{formatNumber(item.rap)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-medium text-primary">{formatPrice(item.price)}</p>
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : ""
        }`}
      >
        <Link href={`/item/${item.id}`} className="gaming-button text-sm font-medium">
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

