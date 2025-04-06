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
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { MessageSquare, Mail, Phone, CheckCircle, Loader2 } from "lucide-react"

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
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (pageRef.current) {
      gsap.from(".support-title", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(".support-subtitle", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(".support-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      })

      gsap.from(".faq-section", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      })
    }
  }, [])

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true)
    setIsSuccess(true)
    toast({
      title: "Support Request Submitted",
      description: "We'll get back to you as soon as possible!",
    })
    form.reset()
    setIsSubmitting(false)
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
        <div className="support-card rounded-lg border bg-card p-6 shadow-sm flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-gaming text-xl">Live Chat</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Chat with our support team in real-time for immediate assistance.
          </p>
          <Button className="mt-auto">Start Chat</Button>
        </div>

        <div className="support-card rounded-lg border bg-card p-6 shadow-sm flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-gaming text-xl">Email Support</h3>
          <p className="mb-4 text-sm text-muted-foreground">Send us an email and we'll respond within 24 hours.</p>
          <Button variant="outline" className="mt-auto border-primary/50 text-primary hover:bg-primary/10">
            support@bloxyskins.com
          </Button>
        </div>

        <div className="support-card rounded-lg border bg-card p-6 shadow-sm flex flex-col items-center text-center">
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
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-6 font-gaming text-2xl text-primary">Get in Touch</h2>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-green-500/10 p-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Request Submitted Successfully!</h3>
                  <p className="mb-2 text-muted-foreground">
                    Thank you for reaching out. Our support team will review your request and get back to you shortly.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} className="w-full sm:w-auto">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
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

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="faq-section rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-6 font-gaming text-2xl text-primary">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">How do I purchase items on BloxySkins?</AccordionTrigger>
                  <AccordionContent>
                    To purchase items on BloxySkins, simply browse our marketplace, find the item you want, and click
                    the "Buy Now" button. You'll be guided through our secure checkout process where you can select your
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
                  <AccordionTrigger className="text-left">How do I become a seller on BloxySkins?</AccordionTrigger>
                  <AccordionContent>
                    To become a seller, you need to apply through our Seller Application form. We review all
                    applications carefully to ensure the quality and legitimacy of items on our marketplace. Once
                    approved, you'll be able to list your items for sale and start earning.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">Is it safe to buy and sell on BloxySkins?</AccordionTrigger>
                  <AccordionContent>
                    Yes, BloxySkins provides a secure platform for buying and selling gaming items. We have multiple
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

      {/* Contact Information */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-gaming text-xl text-primary">Business Hours</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-gaming text-xl text-primary">Contact Information</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <span>support@bloxyskins.com</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-4 w-4 text-primary" />
              <span>Live chat available during business hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
