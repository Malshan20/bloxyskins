"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { GameCategory } from "@/components/marketplace-provider"

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  rap: z.coerce.number().positive({
    message: "RAP must be a positive number.",
  }),
  rarity: z.string().optional(),
  image: z.string().min(1, {
    message: "Please provide an image URL.",
  }),
  featured: z.boolean().default(false),
  new: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      rap: 0,
      rarity: "",
      image: "",
      featured: false,
      new: false,
    },
  })

  function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Product Added",
        description: "The product has been added successfully.",
      })

      router.push("/admin/products")
    }, 1500)
  }

  const categories: GameCategory[] = ["All", "Limiteds", "CS2", "Dota 2", "Rust", "In Game"]
  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="add-product-title mt-4 font-gaming text-3xl text-primary">Add New Product</h1>
      </div>

      <div className="add-product-form gaming-card max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 bg-background focus-visible:ring-primary">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat !== "All")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>The selling price in USD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>Recent Average Price</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rarity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 bg-background focus-visible:ring-primary">
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rarities.map((rarity) => (
                          <SelectItem key={rarity} value={rarity}>
                            {rarity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.png"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>URL of the product image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                      <FormDescription>Featured products appear on the homepage</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>New Product</FormLabel>
                      <FormDescription>Mark this product as new</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                Cancel
              </Button>
              <Button type="submit" className="gaming-button" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
