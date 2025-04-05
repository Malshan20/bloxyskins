"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export type UserRole = "user" | "seller" | "admin"

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: UserRole
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  socialLogin: (provider: "discord" | "google" | "github") => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("nexusgear-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("nexusgear-user")
      }
    }
    setIsLoading(false)
  }, [])

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - in a real app, this would be a server call
        if (email === "demo@example.com" && password === "password123") {
          const newUser: User = {
            id: "user-1",
            username: "DemoUser",
            email: email,
            avatar: "/placeholder.svg?height=40&width=40",
            role: "user",
          }

          setUser(newUser)
          localStorage.setItem("nexusgear-user", JSON.stringify(newUser))

          toast({
            title: "Login Successful",
            description: "Welcome back to NexusGear!",
          })

          setIsLoading(false)
          resolve(true)
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Try demo@example.com / password123",
            variant: "destructive",
          })

          setIsLoading(false)
          resolve(false)
        }
      }, 1500)
    })
  }

  // Mock register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          username,
          email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: "user",
        }

        setUser(newUser)
        localStorage.setItem("nexusgear-user", JSON.stringify(newUser))

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Welcome to NexusGear!",
        })

        setIsLoading(false)
        resolve(true)
      }, 1500)
    })
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("nexusgear-user")
    router.push("/")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  // Social login function
  const socialLogin = (provider: "discord" | "google" | "github") => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: `${provider}User${Math.floor(Math.random() * 1000)}`,
        email: `${provider}user${Math.floor(Math.random() * 1000)}@example.com`,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "user",
      }

      setUser(newUser)
      localStorage.setItem("nexusgear-user", JSON.stringify(newUser))

      toast({
        title: "Login Successful",
        description: `You've successfully logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`,
      })

      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        socialLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

