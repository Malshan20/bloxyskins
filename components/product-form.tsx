"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X, ImageIcon } from "lucide-react"

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  type: z.string({
    required_error: "Please select a product type.",
  }),
  status: z.string().default("draft"),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: any
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [digitalFiles, setDigitalFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<ProductFormValues> = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    type: product?.type || "",
    status: product?.status?.toLowerCase() || "draft",
    featured: product?.featured || false,
    tags: product?.tags || "",
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data)
      console.log("Product images:", files)
      console.log("Digital files:", digitalFiles)
      setIsSubmitting(false)
      onClose()
    }, 1500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls([...previewUrls, ...newPreviewUrls])
    }
  }

  const handleDigitalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setDigitalFiles([...digitalFiles, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    const newFiles = [...files]
    const newPreviewUrls = [...previewUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
  }

  const removeDigitalFile = (index: number) => {
    const newFiles = [...digitalFiles]
    newFiles.splice(index, 1)
    setDigitalFiles(newFiles)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>
              {product ? "Update your digital product details" : "Create a new digital product to sell"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="digital">Digital Files</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormDescription>This is the name that will be displayed to customers.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your product" className="min-h-32 resize-y" {...field} />
                      </FormControl>
                      <FormDescription>Provide a detailed description of your product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ebooks">eBooks</SelectItem>
                            <SelectItem value="courses">Courses</SelectItem>
                            <SelectItem value="templates">Templates</SelectItem>
                            <SelectItem value="graphics">Graphics</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="download">Downloadable</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. design, template, business (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>Add tags to help customers find your product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>Featured products are displayed prominently on your store.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("media")}>
                    Next: Add Media
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-images">Product Images</Label>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md border bg-muted/20 p-2">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Product preview ${index + 1}`}
                        className="h-40 w-full rounded object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-medium">Drag & drop or click to upload</div>
                      <Input
                        id="product-images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Label htmlFor="product-images" className="cursor-pointer text-sm text-primary underline">
                        Browse files
                      </Label>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload high-quality images of your product. First image will be used as the cover.
                </p>
              </div>

              <div className="flex justify-between space-x-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back: Basic Info
                </Button>
                <Button type="button" onClick={() => setActiveTab("digital")}>
                  Next: Digital Files
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digital" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="digital-files">Digital Files</Label>
                <div className="mt-2 space-y-2">
                  {digitalFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeDigitalFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-medium">Upload your digital product files</div>
                      <p className="text-xs text-muted-foreground">ZIP, PDF, MP3, MP4, etc. (Max 500MB)</p>
                      <Input
                        id="digital-files"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleDigitalFileUpload}
                      />
                      <Label htmlFor="digital-files" className="cursor-pointer text-sm text-primary underline">
                        Browse files
                      </Label>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  These are the files customers will receive after purchase.
                </p>
              </div>

              <div className="flex justify-between space-x-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("media")}>
                  Back: Media
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

