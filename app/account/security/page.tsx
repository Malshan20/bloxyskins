"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Lock, Smartphone, Shield, LogOut, AlertTriangle, History, Loader2, CheckCircle, X, Eye, EyeOff } from 'lucide-react'
import { motion } from "framer-motion"

// Mock login history data
const loginHistory = [
  {
    id: "login_1",
    device: "Windows PC - Chrome",
    location: "New York, USA",
    ip: "192.168.1.1",
    date: "2023-04-01T14:30:00Z",
    current: true,
  },
  {
    id: "login_2",
    device: "iPhone - Safari",
    location: "Los Angeles, USA",
    ip: "192.168.1.2",
    date: "2023-03-28T10:15:00Z",
    current: false,
  },
  {
    id: "login_3",
    device: "Android - Chrome",
    location: "Chicago, USA",
    ip: "192.168.1.3",
    date: "2023-03-25T08:45:00Z",
    current: false,
  },
]

export default function SecurityPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [sessionToLogout, setSessionToLogout] = useState<string | null>(null)
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password do not match.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    
    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
  }
  
  const handleToggleTwoFactor = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTwoFactorEnabled(false)
      setIsLoading(false)
      
      toast({
        title: "Two-factor authentication disabled",
        description: "Two-factor authentication has been disabled for your account.",
      })
    } else {
      // Show QR code to enable 2FA
      setShowQRCode(true)
    }
  }
  
  const handleVerifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      })
      return
    }
    
    setIsVerifying(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsVerifying(false)
    setShowQRCode(false)
    setTwoFactorEnabled(true)
    setVerificationCode("")
    
    toast({
      title: "Two-factor authentication enabled",
      description: "Two-factor authentication has been enabled for your account.",
    })
  }
  
  const handleLogoutSession = async () => {
    if (!sessionToLogout) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove the session from the list
    const updatedHistory = loginHistory.filter(session => session.id !== sessionToLogout)
    
    setIsLoading(false)
    setSessionToLogout(null)
    
    toast({
      title: "Session terminated",
      description: "The selected session has been logged out successfully.",
    })
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-gaming text-2xl text-primary">Security Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account security and login settings
        </p>
      </div>
      
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="two-factor">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="sessions">Login Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="two-factor" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    {twoFactorEnabled ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle className="h-3 w-3" />
                        Enabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        <AlertTriangle className="h-3 w-3" />
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled
                      ? "Your account is protected with two-factor authentication."
                      : "Protect your account with an authenticator app."}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggleTwoFactor}
                  disabled={isLoading}
                />
              </div>
              
              {twoFactorEnabled && (
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-2 font-medium">Recovery Codes</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Recovery codes can be used to access your account if you lose your two-factor authentication device.
                  </p>
                  <Button variant="outline" size="sm">
                    View Recovery Codes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* QR Code Dialog for 2FA Setup */}
          <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set up two-factor authentication</DialogTitle>
                <DialogDescription>
                  Scan the QR code with your authenticator app and enter the verification code below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="mb-4 h-48 w-48 rounded-lg bg-gray-100 p-2">
                  {/* Placeholder for QR code */}
                  <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-center text-sm text-muted-foreground">QR Code Placeholder</p>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                  <Button
                    onClick={handleVerifyTwoFactor}
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify and Enable"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your active login sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loginHistory.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{session.device}</h3>
                      {session.current && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.ip}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {formatDate(session.date)}
                    </p>
                  </div>
                  {!session.current && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Logout session?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to log out this session on {session.device}? This will immediately terminate the session.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setSessionToLogout(session.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isLoading && sessionToLogout === session.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <LogOut className="mr-2 h-4 w-4" />
                            )}
                            Logout Session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </motion.div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                Logout All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
