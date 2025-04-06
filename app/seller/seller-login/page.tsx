"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Eye, EyeOff, ShoppingBag, ArrowRight } from 'lucide-react'

// Mock user provider - replace with your actual authentication logic
const useUser = () => {
  const { toast } = useToast()
  
  return {
    isAuthenticated: false,
    user: null,
    sellerLogin: async (email: string, password: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo credentials check
      if (email === "seller@example.com" && password === "sellerpass123") {
        toast({
          title: "Login successful",
          description: "Welcome back to your seller dashboard!",
        })
        return true
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      })
      return false
    },
    socialSellerLogin: (provider: string) => {
      toast({
        description: `${provider} login initiated. This would redirect to ${provider} in a real application.`,
      })
      // In a real app, this would redirect to the OAuth provider
    }
  }
}

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  rememberMe: z.boolean().optional(),
})

export default function SellerLoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)
  const { sellerLogin, socialSellerLogin, isAuthenticated, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/seller"

  // Redirect if already logged in as seller
  useEffect(() => {
    if (isAuthenticated && user?.role === "seller") {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, user, router, redirectUrl])

  useGSAP(() => {
    if (pageRef.current) {
      gsap.from(".login-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(".login-title", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(".social-login", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      })
    }
  }, [])

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoggingIn(true)

    const success = await sellerLogin(values.email, values.password)

    setIsLoggingIn(false)

    if (success) {
      router.push(redirectUrl)
    }
  }

  const handleSocialLogin = (provider: "discord" | "google") => {
    socialSellerLogin(provider)
  }

  if (isAuthenticated && user?.role === "seller") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You are already logged in as a seller</h1>
          <p className="mt-2 text-muted-foreground">Redirecting you to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
      <div className="login-card mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg">
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="login-title text-3xl font-bold text-primary">SELLER LOGIN</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access your seller dashboard</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="social-login flex w-full items-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                onClick={() => handleSocialLogin("discord")}
              >
                <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
                <span>Discord</span>
              </Button>

              <Button
                variant="outline"
                className="social-login flex w-full items-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                onClick={() => handleSocialLogin("google")}
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Google</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
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

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="border-border/50 bg-background focus-visible:ring-primary pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80"
                    onClick={() => {
                      loginForm.setValue("email", "seller@example.com")
                      loginForm.setValue("password", "sellerpass123")
                    }}
                  >
                    Use demo seller credentials
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor="remember-me"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  />

                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Signing in..." : "Sign In as Seller"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Demo credentials: seller@example.com / sellerpass123
                </p>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Not a seller yet?</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link href="/seller-application">
                  <Button variant="outline" className="w-full">
                    Apply to become a seller <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom Discord Icon component
function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
      <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
      <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
    </svg>
  )
}

// Custom Google Icon component
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
