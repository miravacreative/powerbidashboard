"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit3,
  EyeOff,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { EnhancedVisualEditor } from "./enhanced-visual-editor"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar?: string
}

interface UserDashboardEditorProps {
  user: User
  currentUserRole: "admin" | "developer" | "editor"
  onBack: () => void
}

interface PageContent {
  layout: string
  sections: Array<{
    id: string
    type: string
    content: any
    styles?: any
  }>
}

interface SaveStatus {
  status: "idle" | "saving" | "saved" | "error"
  message?: string
}

export function UserDashboardEditor({ user, currentUserRole, onBack }: UserDashboardEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [pageContent, setPageContent] = useState<PageContent>({
    layout: "grid",
    sections: [
      {
        id: "welcome",
        type: "text",
        content: `Welcome back, ${user.name}!`,
        styles: { fontSize: "24px", fontWeight: "bold", color: "#1f2937" },
      },
      {
        id: "stats",
        type: "stats",
        content: {
          totalOrders: 156,
          pendingShipments: 23,
          completedDeliveries: 133,
          revenue: "$45,230",
        },
      },
    ],
  })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: "idle" })

  // Auto-save functionality
  const autoSave = useCallback(
    async (content: PageContent) => {
      if (currentUserRole !== "developer" && currentUserRole !== "editor") return

      setSaveStatus({ status: "saving" })

      try {
        const response = await fetch(`/api/pages/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            title: `${user.name}'s Dashboard`,
            userId: user.id,
          }),
        })

        if (response.ok) {
          setSaveStatus({ status: "saved", message: "Changes saved automatically" })
          setTimeout(() => setSaveStatus({ status: "idle" }), 3000)
        } else {
          throw new Error("Failed to save")
        }
      } catch (error) {
        setSaveStatus({ status: "error", message: "Failed to save changes" })
        setTimeout(() => setSaveStatus({ status: "idle" }), 5000)
      }
    },
    [user.id, currentUserRole],
  )

  // Debounced auto-save
  useEffect(() => {
    if (!isEditMode) return

    const timeoutId = setTimeout(() => {
      autoSave(pageContent)
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [pageContent, isEditMode, autoSave])

  const handleContentChange = (newContent: PageContent) => {
    setPageContent(newContent)
  }

  const canEdit = currentUserRole === "developer" || currentUserRole === "editor"

  const renderSaveStatus = () => {
    switch (saveStatus.status) {
      case "saving":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Saving...</span>
          </div>
        )
      case "saved":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Saved</span>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Error saving</span>
          </div>
        )
      default:
        return null
    }
  }

  const renderUserDashboard = () => {
    const welcomeSection = pageContent.sections.find((s) => s.id === "welcome")
    const statsSection = pageContent.sections.find((s) => s.id === "stats")

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl">{welcomeSection?.content || `Welcome back, ${user.name}!`}</CardTitle>
                <p className="text-muted-foreground">Here's your dashboard overview</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{statsSection?.content?.totalOrders || 156}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{statsSection?.content?.pendingShipments || 23}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{statsSection?.content?.completedDeliveries || 133}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">{statsSection?.content?.revenue || "$45,230"}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Order #12345 delivered successfully</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">New shipment #12346 created</p>
                  <p className="text-sm text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Payment pending for order #12344</p>
                  <p className="text-sm text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Preview as {user.name}</h2>
            <p className="text-muted-foreground">
              Viewing dashboard as {user.role} • {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {renderSaveStatus()}

          {canEdit && (
            <Button variant={isEditMode ? "default" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Exit Edit
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Mode
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Content */}
      {isEditMode && canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Edit Dashboard Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedVisualEditor initialContent={pageContent} onChange={handleContentChange} autoSave={true} />
          </CardContent>
        </Card>
      ) : (
        renderUserDashboard()
      )}

      {/* Edit Mode Indicator */}
      {isEditMode && canEdit && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-medium">Edit Mode Active</span>
        </div>
      )}
    </div>
  )
}
