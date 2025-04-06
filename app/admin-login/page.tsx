"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key } from "lucide-react"

export default function AdminAuth() {
  const [activeTab, setActiveTab] = useState<string>("login")

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full">
            <Shield className="h-8 w-8 text-red-600" strokeWidth={1.5} fill="rgba(220, 38, 38, 0.2)" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-red-600">ADMIN ACCESS</h1>
          <p className="text-sm text-gray-400">Secure login for administrative access</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* Login Tab Content */}
          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="border-0 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-0 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-key" className="text-sm font-medium text-gray-300">
                Admin Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="admin-key"
                  type="text"
                  placeholder="Enter admin key"
                  className="border-0 bg-gray-900 pl-10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="text-right">
              <Button variant="link" className="h-auto p-0 text-xs text-red-600 hover:text-red-500">
                Use demo admin credentials
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="h-auto p-0 text-xs text-red-600 hover:text-red-500">
                Forgot password?
              </Button>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = '/admin'}>Admin Sign In</Button>

            <div className="text-center text-xs text-gray-400">
              Demo credentials: admin@example.com / adminpass123 / admin123
            </div>

            <div className="text-center">
              <Button variant="link" className="h-auto p-0 text-xs text-red-600 hover:text-red-500" onClick={() => window.location.href = '/login'}>
                Return to regular login
              </Button>
            </div>
          </TabsContent>

          {/* Register Tab Content */}
          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="register-email"
                type="email"
                placeholder="admin@example.com"
                className="border-0 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                className="border-0 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="border-0 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-admin-key" className="text-sm font-medium text-gray-300">
                Admin Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="register-admin-key"
                  type="text"
                  placeholder="Enter admin key"
                  className="border-0 bg-gray-900 pl-10 text-white placeholder:text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Admin key is required for registration and is provided by system administrators
              </p>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = '/admin'}>Register Admin Account</Button>

            <div className="text-center">
              <Button variant="link" className="h-auto p-0 text-xs text-red-600 hover:text-red-500" onClick={() => window.location.href = '/login'}>
                Return to regular login
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

