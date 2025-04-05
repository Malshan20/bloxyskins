"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, MessageSquare, Trash, CheckCircle, Clock } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useToast } from "@/hooks/use-toast"

// Mock support messages data
const mockSupportMessages = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Payment Issue",
    message: "I'm having trouble with my payment. The transaction failed but I was still charged.",
    status: "unread",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Item Not Received",
    message: "I purchased an item yesterday but haven't received it in my inventory yet.",
    status: "read",
    date: "2023-05-14T14:45:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    subject: "Refund Request",
    message: "I would like to request a refund for my recent purchase as it was not as described.",
    status: "pending",
    date: "2023-05-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    subject: "Account Access",
    message: "I'm unable to access my account after changing my password. Please help.",
    status: "resolved",
    date: "2023-05-12T16:20:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    subject: "Technical Issue",
    message: "The website keeps crashing when I try to add items to my cart.",
    status: "unread",
    date: "2023-05-11T11:05:00Z",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    subject: "Billing Question",
    message: "I have a question about the billing on my last purchase. Can you explain the fees?",
    status: "read",
    date: "2023-05-10T13:40:00Z",
  },
  {
    id: "7",
    name: "Alex Wilson",
    email: "alex.wilson@example.com",
    subject: "Item Quality",
    message: "The item I received is of lower quality than what was advertised. What can be done?",
    status: "pending",
    date: "2023-05-09T15:55:00Z",
  },
  {
    id: "8",
    name: "Olivia Taylor",
    email: "olivia.taylor@example.com",
    subject: "Delivery Delay",
    message: "My order is taking longer than expected to be delivered. Can you check the status?",
    status: "resolved",
    date: "2023-05-08T10:10:00Z",
  },
]

type SupportMessage = (typeof mockSupportMessages)[0]
type MessageStatus = "unread" | "read" | "pending" | "resolved"

export default function AdminSupport() {
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMessages, setFilteredMessages] = useState<SupportMessage[]>([])
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all")
  const router = useRouter()
  const { toast } = useToast()

  useGSAP(() => {
    gsap.from(".support-title", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".support-actions", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".support-table", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call
    setMessages(mockSupportMessages)
  }, [])

  useEffect(() => {
    let filtered = messages

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((message) => message.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query),
      )
    }

    setFilteredMessages(filtered)
  }, [searchQuery, statusFilter, messages])

  const handleDeleteMessage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      // In a real app, this would be an API call
      setMessages((prev) => prev.filter((message) => message.id !== id))

      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      })
    }
  }

  const handleUpdateStatus = (id: string, status: MessageStatus) => {
    // In a real app, this would be an API call
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, status } : message)))

    toast({
      title: "Status Updated",
      description: `Message status updated to ${status}.`,
    })
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

  return (
    <div>
      <h1 className="support-title mb-8 font-gaming text-3xl text-primary">Support Messages</h1>

      <div className="support-actions mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("unread")}
            className={statusFilter === "unread" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            Unread
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={statusFilter === "pending" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("resolved")}
            className={statusFilter === "resolved" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Resolved
          </Button>
        </div>
      </div>

      <div className="support-table rounded-md border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{message.subject}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{message.message}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(message.status)}</TableCell>
                <TableCell>{formatDate(message.date)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/admin/support/${message.id}`)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, "read")}>
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, "pending")}>
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, "resolved")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Mark as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredMessages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

