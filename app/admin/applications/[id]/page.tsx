"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash, CheckCircle, XCircle, Send } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useToast } from "@/hooks/use-toast"

// Reusing the mock data from the applications page
const mockSellerApplications = [
  {
    id: "1",
    username: "JohnDoe123",
    email: "john.doe@example.com",
    discord: "JohnDoe#1234",
    experience: "intermediate",
    items:
      "I want to sell Limiteds and CS2 items. I have a collection of rare items that I've acquired over the years.",
    date: "2023-05-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    username: "GamingQueen",
    email: "sarah.gaming@example.com",
    discord: "GamingQueen#5678",
    experience: "experienced",
    items: "I specialize in Dota 2 and Rust items. I have a large inventory of rare skins and collectibles.",
    date: "2023-05-14T14:45:00Z",
    status: "approved",
  },
  {
    id: "3",
    username: "TradeMaster",
    email: "trade.master@example.com",
    discord: "TradeMaster#9012",
    experience: "professional",
    items:
      "I'm a professional trader with experience in CS2, Dota 2, and Rust items. I have connections with suppliers and can provide a steady stream of items.",
    date: "2023-05-13T09:15:00Z",
    status: "rejected",
  },
  {
    id: "4",
    username: "NewSeller42",
    email: "new.seller@example.com",
    discord: "NewSeller#3456",
    experience: "beginner",
    items: "I'm new to selling but have a good collection of Limiteds that I'd like to sell on your platform.",
    date: "2023-05-12T16:20:00Z",
    status: "pending",
  },
  {
    id: "5",
    username: "ItemCollector",
    email: "collector@example.com",
    discord: "Collector#7890",
    experience: "intermediate",
    items:
      "I collect rare in-game items and would like to sell some of my duplicates. I have items from various games including Limiteds and CS2.",
    date: "2023-05-11T11:05:00Z",
    status: "pending",
  },
]

type SellerApplication = (typeof mockSellerApplications)[0]
type ApplicationStatus = "pending" | "approved" | "rejected"

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const [application, setApplication] = useState<SellerApplication | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useGSAP(() => {
    gsap.from(".application-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".feedback-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call
    const foundApplication = mockSellerApplications.find((a) => a.id === id)
    setApplication(foundApplication || null)
  }, [id])

  const handleUpdateStatus = (status: ApplicationStatus) => {
    // In a real app, this would be an API call
    if (application) {
      setApplication({ ...application, status })

      toast({
        title: "Status Updated",
        description: `Application status updated to ${status}.`,
      })
    }
  }

  const handleDeleteApplication = () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      // In a real app, this would be an API call
      toast({
        title: "Application Deleted",
        description: "The application has been deleted successfully.",
      })

      router.push("/admin/applications")
    }
  }

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please enter feedback message.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSending(false)
      setFeedback("")

      toast({
        title: "Feedback Sent",
        description: "Your feedback has been sent successfully.",
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

  const formatExperience = (experience: string) => {
    return experience.charAt(0).toUpperCase() + experience.slice(1)
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500">
            Rejected
          </Badge>
        )
    }
  }

  if (!application) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Application not found</h2>
          <p className="mt-2 text-muted-foreground">The application you're looking for doesn't exist.</p>
          <Link href="/admin/applications" className="mt-4 inline-block">
            <Button variant="outline">Back to Applications</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/applications"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-gaming text-3xl text-primary">Seller Application</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus("approved")}
            className="border-green-500/50 text-green-500 hover:bg-green-500/10"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus("rejected")}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteApplication}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="application-card gaming-card mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{application.username}</CardTitle>
              <CardDescription>{application.email}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>{getStatusBadge(application.status)}</div>
              <CardDescription>{formatDate(application.date)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Discord</h3>
            <p>{application.discord}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
            <p>{formatExperience(application.experience)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Items to Sell</h3>
            <p className="whitespace-pre-line">{application.items}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="feedback-card gaming-card">
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Send feedback to the applicant</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your feedback here..."
            className="min-h-32 border-border/50 bg-background focus-visible:ring-primary"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFeedback("")} disabled={!feedback.trim() || isSending}>
            Clear
          </Button>
          <Button className="gaming-button" onClick={handleSendFeedback} disabled={!feedback.trim() || isSending}>
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Feedback
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

