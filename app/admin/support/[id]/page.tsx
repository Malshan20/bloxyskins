"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Trash, CheckCircle, Clock } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useToast } from "@/hooks/use-toast"

// Reusing the mock data from the support page
const mockSupportMessages = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Payment Issue",
    message:
      "I'm having trouble with my payment. The transaction failed but I was still charged. I tried to contact my bank but they said the transaction went through successfully. Can you please check on your end and help me resolve this issue? Thank you.",
    status: "unread",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Item Not Received",
    message:
      "I purchased an item yesterday but haven't received it in my inventory yet. The payment has been processed and I received a confirmation email, but the item is not showing up in my account. Can you please check the status of my order?",
    status: "read",
    date: "2023-05-14T14:45:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    subject: "Refund Request",
    message:
      "I would like to request a refund for my recent purchase as it was not as described. The item description mentioned certain features that are not present in the actual item. I've attached screenshots for reference. Please process my refund as soon as possible.",
    status: "pending",
    date: "2023-05-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    subject: "Account Access",
    message:
      "I'm unable to access my account after changing my password. I've tried resetting my password multiple times but I'm not receiving the reset email. I've checked my spam folder as well. Please help me regain access to my account.",
    status: "resolved",
    date: "2023-05-12T16:20:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    subject: "Technical Issue",
    message:
      "The website keeps crashing when I try to add items to my cart. I've tried using different browsers and devices but the issue persists. This has been happening for the past two days. Please fix this issue so I can complete my purchase.",
    status: "unread",
    date: "2023-05-11T11:05:00Z",
  },
]

type SupportMessage = (typeof mockSupportMessages)[0]
type MessageStatus = "unread" | "read" | "pending" | "resolved"

export default function SupportMessageDetail() {
  const { id } = useParams<{ id: string }>()
  const [message, setMessage] = useState<SupportMessage | null>(null)
  const [reply, setReply] = useState("")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useGSAP(() => {
    gsap.from(".message-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".reply-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call
    const foundMessage = mockSupportMessages.find((m) => m.id === id)
    setMessage(foundMessage || null)

    // Mark as read if it was unread
    if (foundMessage && foundMessage.status === "unread") {
      foundMessage.status = "read"
    }
  }, [id])

  const handleUpdateStatus = (status: MessageStatus) => {
    // In a real app, this would be an API call
    if (message) {
      setMessage({ ...message, status })

      toast({
        title: "Status Updated",
        description: `Message status updated to ${status}.`,
      })
    }
  }

  const handleDeleteMessage = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      // In a real app, this would be an API call
      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      })

      router.push("/admin/support")
    }
  }

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter a reply message.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSending(false)
      setReply("")

      // Mark as resolved
      if (message) {
        setMessage({ ...message, status: "resolved" })
      }

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      })
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case "unread":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500">
            Unread
          </Badge>
        )
      case "read":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
            Read
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-500/20 text-orange-500">
            Pending
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500">
            Resolved
          </Badge>
        )
    }
  }

  if (!message) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Message not found</h2>
          <p className="mt-2 text-muted-foreground">The message you're looking for doesn't exist.</p>
          <Link href="/admin/support" className="mt-4 inline-block">
            <Button variant="outline">Back to Support</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/support"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Support Messages
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-gaming text-3xl text-primary">{message.subject}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus("pending")}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            <Clock className="mr-2 h-4 w-4" />
            Mark Pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus("resolved")}
            className="border-green-500/50 text-green-500 hover:bg-green-500/10"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Resolved
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteMessage}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="message-card gaming-card mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{message.name}</CardTitle>
              <CardDescription>{message.email}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>{getStatusBadge(message.status)}</div>
              <CardDescription>{formatDate(message.date)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{message.message}</p>
        </CardContent>
      </Card>

      <Card className="reply-card gaming-card">
        <CardHeader>
          <CardTitle>Reply</CardTitle>
          <CardDescription>Send a response to the customer</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your reply here..."
            className="min-h-32 border-border/50 bg-background focus-visible:ring-primary"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setReply("")} disabled={!reply.trim() || isSending}>
            Clear
          </Button>
          <Button className="gaming-button" onClick={handleSendReply} disabled={!reply.trim() || isSending}>
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

