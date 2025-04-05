"use client"

import { useRef } from "react"
import { Star } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export function TrustpilotBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center space-y-2 py-4 text-center md:flex-row md:space-x-4 md:space-y-0"
    >
      <p className="text-sm text-muted-foreground">Our customers say</p>
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" strokeWidth={1.5} />
        ))}
      </div>
      <p className="text-sm">
        <span className="font-medium">4.2</span> out of <span className="font-medium">5</span> based on{" "}
        <span className="font-medium">531</span> reviews
      </p>
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-primary text-primary" strokeWidth={1.5} />
        <span className="text-sm font-medium">Trustpilot</span>
      </div>
    </div>
  )
}

