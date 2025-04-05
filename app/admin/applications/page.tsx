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
import { Search, MoreHorizontal, Eye, Trash, CheckCircle, XCircle } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useToast } from "@/hooks/use-toast"

// Mock seller applications data
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
  {
    id: "6",
    username: "ProTrader",
    email: "pro.trader@example.com",
    discord: "ProTrader#1357",
    experience: "professional",
    items:
      "I've been trading professionally for 5 years. I specialize in high-value items and can provide authentication for all my items.",
    date: "2023-05-10T13:40:00Z",
    status: "approved",
  },
  {
    id: "7",
    username: "GamingSupplier",
    email: "supplier@example.com",
    discord: "Supplier#2468",
    experience: "experienced",
    items:
      "I have direct connections with game developers and can supply new and exclusive items as soon as they're released.",
    date: "2023-05-09T15:55:00Z",
    status: "pending",
  },
  {
    id: "8",
    username: "CasualSeller",
    email: "casual.seller@example.com",
    discord: "CasualSeller#3690",
    experience: "beginner",
    items:
      "I occasionally get rare drops in games and would like to sell them instead of keeping them in my inventory.",
    date: "2023-05-08T10:10:00Z",
    status: "rejected",
  },
]

type SellerApplication = (typeof mockSellerApplications)[0]
type ApplicationStatus = "pending" | "approved" | "rejected"

export default function AdminApplications() {
  const [applications, setApplications] = useState<SellerApplication[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredApplications, setFilteredApplications] = useState<SellerApplication[]>([])
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const router = useRouter()
  const { toast } = useToast()

  useGSAP(() => {
    gsap.from(".applications-title", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".applications-actions", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".applications-table", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call
    setApplications(mockSellerApplications)
  }, [])

  useEffect(() => {
    let filtered = applications

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((application) => application.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (application) =>
          application.username.toLowerCase().includes(query) ||
          application.email.toLowerCase().includes(query) ||
          application.discord.toLowerCase().includes(query) ||
          application.items.toLowerCase().includes(query),
      )
    }

    setFilteredApplications(filtered)
  }, [searchQuery, statusFilter, applications])

  const handleDeleteApplication = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      // In a real app, this would be an API call
      setApplications((prev) => prev.filter((application) => application.id !== id))

      toast({
        title: "Application Deleted",
        description: "The application has been deleted successfully.",
      })
    }
  }

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    // In a real app, this would be an API call
    setApplications((prev) =>
      prev.map((application) => (application.id === id ? { ...application, status } : application)),
    )

    toast({
      title: "Status Updated",
      description: `Application status updated to ${status}.`,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div>
      <h1 className="applications-title mb-8 font-gaming text-3xl text-primary">Seller Applications</h1>

      <div className="applications-actions mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
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
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={statusFilter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("approved")}
            className={statusFilter === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("rejected")}
            className={statusFilter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Rejected
          </Button>
        </div>
      </div>

      <div className="applications-table rounded-md border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Discord</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{application.username}</p>
                    <p className="text-xs text-muted-foreground">{application.email}</p>
                  </div>
                </TableCell>
                <TableCell>{formatExperience(application.experience)}</TableCell>
                <TableCell>{application.discord}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>{formatDate(application.date)}</TableCell>
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
                      <DropdownMenuItem onClick={() => router.push(`/admin/applications/${application.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(application.id, "approved")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(application.id, "rejected")}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteApplication(application.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

