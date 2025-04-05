"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CreditCard, Plus, Trash2, Edit, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from "framer-motion"

// Mock payment methods data
const initialPaymentMethods = [
  {
    id: "pm_1",
    type: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
    name: "John Doe",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "mastercard",
    last4: "5555",
    expMonth: 10,
    expYear: 2025,
    name: "John Doe",
    isDefault: false,
  },
]

type PaymentMethod = {
  id: string
  type: string
  last4: string
  expMonth: number
  expYear: number
  name: string
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardName: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    isDefault: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCard((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock card data
    const cardType = newCard.cardNumber.startsWith("4") ? "visa" : "mastercard"
    const last4 = newCard.cardNumber.slice(-4)

    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: cardType,
      last4,
      expMonth: parseInt(newCard.expMonth),
      expYear: parseInt(newCard.expYear),
      name: newCard.cardName,
      isDefault: newCard.isDefault,
    }

    // If new card is default, update other cards
    let updatedMethods = [...paymentMethods]
    if (newCard.isDefault) {
      updatedMethods = updatedMethods.map((method) => ({
        ...method,
        isDefault: false,
      }))
    }

    setPaymentMethods([...updatedMethods, newPaymentMethod])
    setIsLoading(false)
    setIsAddingCard(false)
    
    // Reset form
    setNewCard({
      cardNumber: "",
      cardName: "",
      expMonth: "",
      expYear: "",
      cvc: "",
      isDefault: false,
    })

    toast({
      title: "Payment method added",
      description: `Card ending in ${last4} has been added to your account.`,
    })
  }

  const handleEditCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCard) return
    
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update payment methods
    const updatedMethods = paymentMethods.map((method) => {
      if (method.id === editingCard.id) {
        return editingCard
      }
      
      // If edited card is now default, remove default from others
      if (editingCard.isDefault && method.id !== editingCard.id) {
        return { ...method, isDefault: false }
      }
      
      return method
    })

    setPaymentMethods(updatedMethods)
    setIsLoading(false)
    setEditingCard(null)

    toast({
      title: "Payment method updated",
      description: `Card ending in ${editingCard.last4} has been updated.`,
    })
  }

  const handleDeleteCard = async () => {
    if (!deleteId) return
    
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the card being deleted
    const cardToDelete = paymentMethods.find((method) => method.id === deleteId)
    
    // Remove the card
    const updatedMethods = paymentMethods.filter((method) => method.id !== deleteId)
    
    // If deleted card was default, set a new default if there are remaining cards
    if (cardToDelete?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true
    }

    setPaymentMethods(updatedMethods)
    setIsLoading(false)
    setDeleteId(null)

    toast({
      title: "Payment method removed",
      description: `Card ending in ${cardToDelete?.last4} has been removed from your account.`,
    })
  }

  const setDefaultPaymentMethod = async (id: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update payment methods
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedMethods)
    setIsLoading(false)

    const card = paymentMethods.find((method) => method.id === id)
    
    toast({
      title: "Default payment method updated",
      description: `Card ending in ${card?.last4} is now your default payment method.`,
    })
  }

  // Get card icon based on type
  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "💳 Visa"
      case "mastercard":
        return "💳 Mastercard"
      case "amex":
        return "💳 Amex"
      default:
        return "💳 Card"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-gaming text-2xl text-primary">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">
          Manage your payment methods and billing information
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No payment methods</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                You haven't added any payment methods yet.
              </p>
              <Button onClick={() => setIsAddingCard(true)}>Add Payment Method</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={method.isDefault ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{getCardIcon(method.type)}</span>
                        <CardTitle className="text-base">
                          •••• •••• •••• {method.last4}
                        </CardTitle>
                      </div>
                      {method.isDefault && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          <CheckCircle className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      Expires {method.expMonth}/{method.expYear}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <div>
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          disabled={isLoading}
                        >
                          Set as default
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCard(method)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this card ending in {method.last4}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => setDeleteId(method.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isLoading && deleteId === method.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setIsAddingCard(true)}
          className="gap-2"
          variant={paymentMethods.length === 0 ? "default" : "outline"}
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCard}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  required
                  value={newCard.cardName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expMonth">Month</Label>
                  <Select
                    value={newCard.expMonth}
                    onValueChange={(value) =>
                      setNewCard((prev) => ({ ...prev, expMonth: value }))
                    }
                  >
                    <SelectTrigger id="expMonth">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem
                          key={month}
                          value={month.toString().padStart(2, "0")}
                        >
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expYear">Year</Label>
                  <Select
                    value={newCard.expYear}
                    onValueChange={(value) =>
                      setNewCard((prev) => ({ ...prev, expYear: value }))
                    }
                  >
                    <SelectTrigger id="expYear">
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                        (year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    required
                    maxLength={4}
                    value={newCard.cvc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={newCard.isDefault}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, isDefault: e.target.checked }))
                  }
                />
                <Label htmlFor="isDefault" className="text-sm font-normal">
                  Set as default payment method
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingCard(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Card"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit payment method</DialogTitle>
            <DialogDescription>
              Update your card information.
            </DialogDescription>
          </DialogHeader>
          {editingCard && (
            <form onSubmit={handleEditCard}>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{getCardIcon(editingCard.type)}</span>
                  <p className="text-sm font-medium">
                    •••• •••• •••• {editingCard.last4}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name on Card</Label>
                  <Input
                    id="edit-name"
                    value={editingCard.name}
                    onChange={(e) =>
                      setEditingCard((prev) => prev ? { ...prev, name: e.target.value } : null)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-month">Expiration Month</Label>
                    <Select
                      value={editingCard.expMonth.toString().padStart(2, "0")}
                      onValueChange={(value) =>
                        setEditingCard((prev) =>
                          prev ? { ...prev, expMonth: parseInt(value) } : null
                        )
                      }
                    >
                      <SelectTrigger id="edit-month">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem
                            key={month}
                            value={month.toString().padStart(2, "0")}
                          >
                            {month.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Expiration Year</Label>
                    <Select
                      value={editingCard.expYear.toString()}
                      onValueChange={(value) =>
                        setEditingCard((prev) =>
                          prev ? { ...prev, expYear: parseInt(value) } : null
                        )
                      }
                    >
                      <SelectTrigger id="edit-year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-default"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={editingCard.isDefault}
                    onChange={(e) =>
                      setEditingCard((prev) =>
                        prev ? { ...prev, isDefault: e.target.checked } : null
                      )
                    }
                    disabled={editingCard.isDefault}
                  />
                  <Label htmlFor="edit-default" className="text-sm font-normal">
                    Set as default payment method
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCard(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
