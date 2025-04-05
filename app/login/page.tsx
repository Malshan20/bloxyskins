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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { DiscIcon as Discord, Github } from "lucide-react"
import { useUser } from "@/components/user-provider"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  rememberMe: z.boolean().optional(),
})

const registerFormSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)
  const { login, register, socialLogin, isAuthenticated } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, router, redirectUrl])

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

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoggingIn(true)

    const success = await login(values.email, values.password)

    setIsLoggingIn(false)

    if (success) {
      router.push(redirectUrl)
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsRegistering(true)

    const success = await register(values.username, values.email, values.password)

    setIsRegistering(false)

    if (success) {
      router.push(redirectUrl)
    }
  }

  const handleSocialLogin = (provider: "discord" | "google" | "github") => {
    socialLogin(provider)
  }

  if (isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You are already logged in</h1>
          <p className="mt-2 text-muted-foreground">Redirecting you...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
      <div className="login-card gaming-card mx-auto w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="login-title font-gaming text-3xl font-bold text-primary">BLOXYSKINS</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access your account and marketplace</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="social-login flex w-full items-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                    onClick={() => handleSocialLogin("discord")}
                  >
                    <Discord className="h-4 w-4 text-[#5865F2]" />
                    <span>Discord</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="social-login flex w-full items-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
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
                          loginForm.setValue("email", "demo@example.com")
                          loginForm.setValue("password", "password123")
                        }}
                      >
                        Use demo credentials
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

                    <Button type="submit" className="gaming-button w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? "Signing in..." : "Sign In"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Demo credentials: demo@example.com / password123
                    </p>
                    <div className="mt-4 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Admin Access</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 text-xs"
                        onClick={() => router.push("/admin-login")}
                      >
                        Admin Login
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="social-login flex w-full items-center justify-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                    onClick={() => handleSocialLogin("discord")}
                  >
                    <Discord className="h-4 w-4 text-[#5865F2]" />
                  </Button>

                  <Button
                    variant="outline"
                    className="social-login flex w-full items-center justify-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                  </Button>

                  <Button
                    variant="outline"
                    className="social-login flex w-full items-center justify-center gap-2 border-border/50 bg-background/50 hover:bg-primary/10"
                    onClick={() => handleSocialLogin("github")}
                  >
                    <Github className="h-4 w-4" />
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

                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your username"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              terms and conditions
                            </Link>
                          </label>
                          <FormMessage />
                        </div>
                      )}
                    />

                    <Button type="submit" className="gaming-button w-full" disabled={isRegistering}>
                      {isRegistering ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

