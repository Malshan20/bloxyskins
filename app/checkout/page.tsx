"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowLeft, CreditCard, ShoppingCartIcon as Paypal, Wallet, Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useUser } from "@/components/user-provider"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"

const checkoutFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  state: z.string().min(2, {
    message: "Please enter a valid state/province.",
  }),
  zipCode: z.string().min(3, {
    message: "Please enter a valid ZIP/postal code.",
  }),
  country: z.string().min(2, {
    message: "Please select a country.",
  }),
  paymentMethod: z.enum(["credit-card", "paypal", "crypto"]),
  saveInfo: z.boolean().optional(),
})

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)
  const { items, itemCount, subtotal, clearCart, setIsCartOpen } = useCart()
  const { isAuthenticated, user } = useUser()
  const router = useRouter()

  // Calculate additional costs
  const shippingCost = 0 // Digital items have no shipping
  const taxRate = 0.08
  const taxAmount = subtotal * taxRate
  const totalAmount = subtotal + taxAmount + shippingCost

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
    }
  }, [isAuthenticated, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      router.push("/")
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
      })
    }
  }, [itemCount, router, toast])

  useGSAP(() => {
    if (pageRef.current) {
      gsap.from(".checkout-title", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(".checkout-step", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      })

      gsap.from(".checkout-form", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      })

      gsap.from(".checkout-summary", {
        opacity: 0,
        x: 30,
        duration: 0.8,
        delay: 0.7,
        ease: "power3.out",
      })
    }
  }, [])

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: user?.username || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      paymentMethod: "credit-card",
      saveInfo: false,
    },
  })

  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)

      // Move to confirmation step
      setCurrentStep(3)

      // Clear cart after successful purchase
      clearCart()

      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      })
    }, 2000)
  }

  if (!isAuthenticated || itemCount === 0) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div ref={pageRef} className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => {
              setIsCartOpen(true)
              router.push("/")
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </div>

        <h1 className="checkout-title mb-8 font-gaming text-3xl font-bold text-primary">CHECKOUT</h1>

        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`checkout-step flex flex-1 flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 1 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}
              >
                {currentStep > 1 ? <Check className="h-5 w-5" /> : 1}
              </div>
              <span className="mt-2 text-sm">Shipping</span>
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`checkout-step flex flex-1 flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 2 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}
              >
                {currentStep > 2 ? <Check className="h-5 w-5" /> : 2}
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`checkout-step flex flex-1 flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 3 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}
              >
                3
              </div>
              <span className="mt-2 text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        {currentStep === 3 ? (
          // Order Confirmation
          <div className="gaming-card mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-gaming text-2xl text-primary">ORDER CONFIRMED</h2>
            <p className="mb-6 text-muted-foreground">
              Thank you for your purchase! Your order has been confirmed and will be processed immediately.
            </p>
            <p className="mb-2 font-medium">
              Order Number: <span className="text-primary">NG-{Math.floor(Math.random() * 10000)}</span>
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              A confirmation email has been sent to {form.getValues().email}
            </p>
            <div className="space-y-2">
              <Link href="/">
                <Button className="gaming-button w-full">Return to Marketplace</Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                  View Order History
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Checkout Form
          <div className="grid gap-8 md:grid-cols-3">
            <div className="checkout-form md:col-span-2">
              <div className="gaming-card">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {currentStep === 1 && (
                      <>
                        <h2 className="mb-4 font-gaming text-xl text-primary">Shipping Information</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Doe"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main St"
                                  {...field}
                                  className="border-border/50 bg-background focus-visible:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="New York"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="NY"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="10001"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="United States"
                                    {...field}
                                    className="border-border/50 bg-background focus-visible:ring-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="saveInfo"
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="save-info"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                              />
                              <label
                                htmlFor="save-info"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Save this information for next time
                              </label>
                            </div>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="button" className="gaming-button" onClick={() => setCurrentStep(2)}>
                            Continue to Payment
                          </Button>
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <h2 className="mb-4 font-gaming text-xl text-primary">Payment Method</h2>

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-4"
                                >
                                  <div className="gaming-card flex items-center space-x-2 border-2 border-transparent p-4 transition-colors hover:border-primary/50 data-[state=checked]:border-primary">
                                    <RadioGroupItem
                                      value="credit-card"
                                      id="credit-card"
                                      className="border-primary text-primary"
                                    />
                                    <label
                                      htmlFor="credit-card"
                                      className="flex flex-1 cursor-pointer items-center gap-3"
                                    >
                                      <CreditCard className="h-5 w-5 text-primary" />
                                      <div>
                                        <div className="font-medium">Credit / Debit Card</div>
                                        <div className="text-xs text-muted-foreground">Pay securely with your card</div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="gaming-card flex items-center space-x-2 border-2 border-transparent p-4 transition-colors hover:border-primary/50 data-[state=checked]:border-primary">
                                    <RadioGroupItem
                                      value="paypal"
                                      id="paypal"
                                      className="border-primary text-primary"
                                    />
                                    <label htmlFor="paypal" className="flex flex-1 cursor-pointer items-center gap-3">
                                      <Paypal className="h-5 w-5 text-[#00457C]" />
                                      <div>
                                        <div className="font-medium">PayPal</div>
                                        <div className="text-xs text-muted-foreground">
                                          Fast and secure payment with PayPal
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="gaming-card flex items-center space-x-2 border-2 border-transparent p-4 transition-colors hover:border-primary/50 data-[state=checked]:border-primary">
                                    <RadioGroupItem
                                      value="crypto"
                                      id="crypto"
                                      className="border-primary text-primary"
                                    />
                                    <label htmlFor="crypto" className="flex flex-1 cursor-pointer items-center gap-3">
                                      <Wallet className="h-5 w-5 text-primary" />
                                      <div>
                                        <div className="font-medium">Cryptocurrency</div>
                                        <div className="text-xs text-muted-foreground">
                                          Pay with Bitcoin, Ethereum, or other cryptocurrencies
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("paymentMethod") === "credit-card" && (
                          <div className="space-y-4 rounded-md border border-border/50 bg-background/50 p-4">
                            <div>
                              <label htmlFor="card-number" className="mb-1 block text-sm font-medium">
                                Card Number
                              </label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                className="border-border/50 bg-background focus-visible:ring-primary"
                                required
                                pattern="[0-9]{13,19}"
                                maxLength={19}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiry" className="mb-1 block text-sm font-medium">
                                  Expiry Date
                                </label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/YY"
                                  className="border-border/50 bg-background focus-visible:ring-primary"
                                  required
                                  pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                                  maxLength={5}
                                />
                              </div>

                              <div>
                                <label htmlFor="cvc" className="mb-1 block text-sm font-medium">
                                  CVC
                                </label>
                                <Input
                                  id="cvc"
                                  placeholder="123"
                                  className="border-border/50 bg-background focus-visible:ring-primary"
                                  required
                                  pattern="[0-9]{3,4}"
                                  maxLength={4}
                                  type="password"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-primary/50 text-primary hover:bg-primary/10"
                            onClick={() => setCurrentStep(1)}
                          >
                            Back
                          </Button>

                          <Button type="submit" className="gaming-button" disabled={isProcessing}>
                            {isProcessing ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                Processing...
                              </>
                            ) : (
                              "Complete Order"
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </Form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-summary">
              <div className="gaming-card">
                <h2 className="mb-4 font-gaming text-xl text-primary">Order Summary</h2>

                <div className="max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="mb-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image || `/placeholder.svg?height=48&width=48`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-1 text-sm font-medium">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">{formatPrice(taxAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

