"use client"

import { useRef } from "react"
import { MarketFilters } from "@/components/market-filters"
import { MarketItemCard } from "@/components/market-item-card"
import { RecentlySold } from "@/components/recently-sold"
import { TrustpilotBanner } from "@/components/trustpilot-banner"
import { GameCategories } from "@/components/game-categories"
import { useMarketplace } from "@/components/marketplace-provider"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const { filteredItems, searchQuery, setSearchQuery } = useMarketplace()
  const heroRef = useRef<HTMLDivElement>(null)
  const marketplaceRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero animations
    if (heroRef.current) {
      gsap.from(".hero-title", {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: -30,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(".hero-search", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      })
    }

    // Parallax effect
    if (marketplaceRef.current) {
      gsap.to(".parallax-bg", {
        y: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: marketplaceRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }
  }, [])

  return (
    <main className="min-h-screen pb-16 pt-20">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden py-20 text-center">
        <div className="parallax-bg absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,58,58,0.15),transparent_50%)]" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="hero-title font-gaming text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            <span className="gaming-gradient-text">BLOXYSKINS</span> MARKETPLACE
          </h1>
          <p className="hero-subtitle mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The ultimate destination for gaming and Roblox items. Buy, sell, and trade with confidence.
          </p>
          <div className="hero-search mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for items..."
                className="h-12 border-primary/20 bg-card/80 pl-10 backdrop-blur-sm focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trustpilot Banner */}
      <div className="border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4">
          <TrustpilotBanner />
        </div>
      </div>

      {/* Recently Sold Section */}
      <section className="container mx-auto px-4 py-8">
        <RecentlySold />
      </section>

      {/* Game Categories */}
      <section className="container mx-auto px-4 py-4">
        <GameCategories />
      </section>

      {/* Marketplace Section */}
      <section ref={marketplaceRef} className="parallax-section container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <MarketFilters />
          </div>

          {/* Items Grid */}
          <div className="md:col-span-3 lg:col-span-4">
            {filteredItems.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-card/50 p-8 text-center">
                <p className="text-lg font-medium">No items found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item, index) => (
                  <MarketItemCard key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="gaming-card overflow-hidden rounded-xl border-primary/20 bg-card/80 p-8 text-center">
          <h2 className="font-gaming text-3xl font-bold text-primary">BECOME A SELLER</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join our marketplace and start selling your gaming and Roblox items to thousands of buyers worldwide.
          </p>
          <div className="mt-8">
            <a href="/seller-application" className="gaming-button inline-block px-8 py-3 text-lg font-medium">
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

