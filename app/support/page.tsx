"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Mail, Phone } from "lucide-react"

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Support Request Submitted",
        description: "We'll get back to you as soon as possible!",
      })
      form.reset()
    }, 1500)
  }

  return (
    <div ref={pageRef} className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="support-title font-gaming text-4xl font-bold text-primary">SUPPORT CENTER</h1>
        <p className="support-subtitle mt-4 text-muted-foreground">
          Need help with your purchases or have questions about our marketplace? We're here to help!
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="support-card gaming-card flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-gaming text-xl">Live Chat</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Chat with our support team in real-time for immediate assistance.
          </p>
          <Button className="mt-auto gaming-button">Start Chat</Button>
        </div>

        <div className="support-card gaming-card flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-gaming text-xl">Email Support</h3>
          <p className="mb-4 text-sm text-muted-foreground">Send us an email and we'll respond within 24 hours.</p>
          <Button variant="outline" className="mt-auto border-primary/50 text-primary hover:bg-primary/10">
            support@nexusgear.com
          </Button>
        </div>

        <div className="support-card gaming-card flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-gaming text-xl">Phone Support</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Call our support team for urgent matters during business hours.
          </p>
          <Button variant="outline" className="mt-auto border-primary/50 text-primary hover:bg-primary/10">
            +1 (555) 123-4567
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-6">
            <div className="gaming-card">
              <h2 className="mb-6 font-gaming text-2xl text-primary">Get in Touch</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
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
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is your inquiry about?"
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue or question in detail..."
                            className="min-h-32 border-border/50 bg-background focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="gaming-button w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="faq-section gaming-card">
              <h2 className="mb-6 font-gaming text-2xl text-primary">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">How do I purchase items on NexusGear?</AccordionTrigger>
                  <AccordionContent>
                    To purchase items on NexusGear, simply browse our marketplace, find the item you want, and click the
                    "Buy Now" button. You'll be guided through our secure checkout process where you can select your
                    preferred payment method. Once your payment is confirmed, the item will be delivered to your
                    account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept various payment methods including credit/debit cards, PayPal, and cryptocurrency. All
                    transactions are secure and encrypted to protect your financial information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">How long does delivery take?</AccordionTrigger>
                  <AccordionContent>
                    Digital items are typically delivered instantly after payment confirmation. For some items, delivery
                    may take up to 24 hours depending on verification processes and seller availability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">What is your refund policy?</AccordionTrigger>
                  <AccordionContent>
                    We offer refunds for items that don't match their description or aren't delivered. Refund requests
                    must be submitted within 48 hours of purchase. Please note that we cannot offer refunds for items
                    that have been used or transferred to another account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">How do I become a seller on NexusGear?</AccordionTrigger>
                  <AccordionContent>
                    To become a seller, you need to apply through our Seller Application form. We review all
                    applications carefully to ensure the quality and legitimacy of items on our marketplace. Once
                    approved, you'll be able to list your items for sale and start earning.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">Is it safe to buy and sell on NexusGear?</AccordionTrigger>
                  <AccordionContent>
                    Yes, NexusGear provides a secure platform for buying and selling gaming items. We have multiple
                    security measures in place, including secure payment processing, seller verification, and a dispute
                    resolution system to ensure a safe trading environment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">What fees do sellers pay?</AccordionTrigger>
                  <AccordionContent>
                    Sellers pay a commission fee of 10% on each successful sale. This fee helps us maintain the
                    platform, provide customer support, and ensure secure transactions for all users.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">How do I report a problem with my purchase?</AccordionTrigger>
                  <AccordionContent>
                    If you encounter any issues with your purchase, please visit our Claims page to submit a detailed
                    report. Our support team will investigate the matter and work to resolve it as quickly as possible.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

