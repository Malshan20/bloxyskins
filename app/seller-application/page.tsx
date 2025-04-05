"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  discord: z.string().min(5, {
    message: "Discord username must be at least 5 characters.",
  }),
  experience: z.string().min(1, {
    message: "Please select your experience level.",
  }),
  items: z.string().min(10, {
    message: "Please describe the items you want to sell (min 10 characters).",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export default function SellerApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (formRef.current) {
      gsap.from(".form-title", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(".form-description", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(".form-field", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      })
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      discord: "",
      experience: "",
      items: "",
      terms: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Application Submitted",
        description: "We'll review your application and get back to you soon!",
      })
      router.push("/")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div ref={formRef} className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="form-title font-gaming text-3xl font-bold text-primary">BECOME A SELLER</h1>
          <p className="form-description mt-2 text-muted-foreground">
            Fill out the form below to apply to become a seller on our marketplace.
          </p>
        </div>

        <div className="gaming-card border-primary/20 bg-card/80">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="form-field">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your username"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>Your public display name on the marketplace.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="form-field">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>We'll use this to contact you about your application.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem className="form-field">
                    <FormLabel>Discord Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username#0000"
                        {...field}
                        className="border-border/50 bg-background focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>For faster communication and support.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="form-field">
                    <FormLabel>Selling Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 bg-background focus-visible:ring-primary">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="experienced">Experienced</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your experience level in selling gaming items.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem className="form-field">
                    <FormLabel>Items to Sell</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the types of items you want to sell..."
                        className="min-h-32 border-border/50 bg-background focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about the items you plan to sell on our marketplace.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="form-field flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormDescription>You must agree to our terms of service and seller guidelines.</FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="gaming-button w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

