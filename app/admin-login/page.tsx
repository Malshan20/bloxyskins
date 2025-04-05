"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Shield, KeyRound } from "lucide-react"
import { useUser } from "@/components/user-provider"

const adminLoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  adminKey: z.string().min(6, {
    message: "Admin key must be at least 6 characters.",
  }),
  rememberMe: z.boolean().optional(),
})

const adminRegisterFormSchema = z
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
    adminKey: z.string().min(6, {
      message: "Admin key must be at least 6 characters.",
    }),
    inviteCode: z.string().min(6, {
      message: "Invite code must be at least 6 characters.",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function AdminLoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useUser()
  const router = useRouter()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin")
    }
  }, [isAuthenticated, user, router])

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
    }
  }, [])

  const loginForm = useForm<z.infer<typeof adminLoginFormSchema>>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      adminKey: "",
      rememberMe: false,
    },
  })

  const registerForm = useForm<z.infer<typeof adminRegisterFormSchema>>({
    resolver: zodResolver(adminRegisterFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminKey: "",
      inviteCode: "",
      terms: false,
    },
  })

  async function onLoginSubmit(values: z.infer<typeof adminLoginFormSchema>) {
    setIsLoggingIn(true)

    // Simulate API call for admin login
    setTimeout(() => {
      // For demo purposes, we'll use hardcoded credentials
      if (
        values.email === "admin@example.com" &&
        values.password === "adminpass123" &&
        values.adminKey === "admin123"
      ) {
        // Create admin user in localStorage
        const adminUser = {
          id: "admin-1",
          username: "AdminUser",
          email: values.email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin" as const,
        }

        localStorage.setItem("nexusgear-user", JSON.stringify(adminUser))

        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin panel!",
        })

        router.push("/admin")
      } else {
        toast({
          title: "Admin Login Failed",
          description: "Invalid credentials. Try admin@example.com / adminpass123 / admin123",
          variant: "destructive",
        })
      }

      setIsLoggingIn(false)
    }, 1500)
  }

  async function onRegisterSubmit(values: z.infer<typeof adminRegisterFormSchema>) {
    setIsRegistering(true)

    // Simulate API call for admin registration
    setTimeout(() => {
      // For demo purposes, we'll use a hardcoded invite code
      if (values.inviteCode === "ADMIN2023") {
        // Create admin user in localStorage
        const adminUser = {
          id: `admin-${Date.now()}`,
          username: values.username,
          email: values.email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin" as const,
        }

        localStorage.setItem("nexusgear-user", JSON.stringify(adminUser))

        toast({
          title: "Admin Registration Successful",
          description: "Your admin account has been created!",
        })

        router.push("/admin")
      } else {
        toast({
          title: "Admin Registration Failed",
          description: "Invalid invite code. Please contact the system administrator.",
          variant: "destructive",
        })
      }

      setIsRegistering(false)
    }, 1500)
  }

  if (isAuthenticated && user?.role === "admin") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You are already logged in as admin</h1>
          <p className="mt-2 text-muted-foreground">Redirecting you to the admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24">
      <div className="login-card gaming-card mx-auto w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="login-title mt-4 font-gaming text-3xl font-bold text-primary">ADMIN ACCESS</h1>
            <p className="mt-2 text-sm text-muted-foreground">Secure login for administrative access</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <div className="space-y-4">
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
                              placeholder="admin@example.com"
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

                    <FormField
                      control={loginForm.control}
                      name="adminKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="Enter admin key"
                                {...field}
                                className="border-border/50 bg-background pl-10 focus-visible:ring-primary"
                              />
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
                          loginForm.setValue("email", "admin@example.com")
                          loginForm.setValue("password", "adminpass123")
                          loginForm.setValue("adminKey", "admin123")
                        }}
                      >
                        Use demo admin credentials
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember-me-admin"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                              htmlFor="remember-me-admin"
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
                      {isLoggingIn ? "Signing in..." : "Admin Sign In"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Demo credentials: admin@example.com / adminpass123 / admin123
                    </p>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <div className="space-y-4">
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
                              placeholder="Admin username"
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
                              placeholder="admin@example.com"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                            <FormLabel>Confirm</FormLabel>
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
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="adminKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="Enter admin key"
                                {...field}
                                className="border-border/50 bg-background pl-10 focus-visible:ring-primary"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="inviteCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invite Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter invite code"
                              {...field}
                              className="border-border/50 bg-background focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">Use "ADMIN2023" for demo purposes</p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms-admin"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor="terms-admin"
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
                      {isRegistering ? "Creating account..." : "Create Admin Account"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Return to regular login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

