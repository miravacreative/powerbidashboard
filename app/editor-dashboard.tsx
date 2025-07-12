"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit, Plus, Search, Eye, ImageIcon, Layout, Calendar, Type } from "lucide-react"
import { UserDashboardEditor } from "@/components/user-dashboard-editor"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  avatar?: string
}

interface Content {
  id: string
  title: string
  type: "article" | "page" | "media"
  status: "published" | "draft" | "review"
  lastModified: string
  author: string
}

export function EditorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingUserDashboard, setViewingUserDashboard] = useState<User | null>(null)

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Sarah Connor",
      email: "sarah@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
    },
    {
      id: "2",
      name: "John Smith",
      email: "john@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "user",
      status: "inactive",
      lastLogin: "2024-01-14 03:45 PM",
    },
  ]

  const content: Content[] = [
    {
      id: "1",
      title: "Welcome Guide",
      type: "article",
      status: "published",
      lastModified: "2024-01-15",
      author: "Editor",
    },
    {
      id: "2",
      title: "User Dashboard Layout",
      type: "page",
      status: "draft",
      lastModified: "2024-01-14",
      author: "Editor",
    },
    {
      id: "3",
      title: "Hero Banner Image",
      type: "media",
      status: "review",
      lastModified: "2024-01-13",
      author: "Designer",
    },
  ]

  const handleViewAsUser = (user: User) => {
    setViewingUserDashboard(user)
  }

  const handleBackFromUserView = () => {
    setViewingUserDashboard(null)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredContent = content.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (viewingUserDashboard) {
    return <UserDashboardEditor user={viewingUserDashboard} currentUserRole="editor" onBack={handleBackFromUserView} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editor Dashboard</h1>
          <p className="text-muted-foreground">Manage content, layouts, and user experiences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
          <Button variant="outline">
            <ImageIcon className="w-4 h-4 mr-2" />
            Media Library
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
            <p className="text-xs text-muted-foreground">
              {content.filter((c) => c.status === "published").length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.filter((c) => c.status === "draft").length}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Pages</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Editable dashboards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">3 items modified</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="user-pages">User Pages</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Content */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {item.title.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.type} • {item.author}
                          </p>
                        </div>
                      </div>
                      <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Content Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Articles</span>
                    <Badge variant="outline">{content.filter((c) => c.type === "article").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pages</span>
                    <Badge variant="outline">{content.filter((c) => c.type === "page").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Media Files</span>
                    <Badge variant="outline">{content.filter((c) => c.type === "media").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Published</span>
                    <Badge variant="default">{content.filter((c) => c.status === "published").length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                        {item.title.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type} • Modified {item.lastModified}
                        </p>
                        <p className="text-xs text-muted-foreground">By {item.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-pages" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Dashboard Editing</CardTitle>
              <p className="text-sm text-muted-foreground">Edit and customize user dashboard layouts and content</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewAsUser(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview & Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium">Images</h4>
                  <p className="text-sm text-muted-foreground">24 files</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium">Documents</h4>
                  <p className="text-sm text-muted-foreground">12 files</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Type className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium">Templates</h4>
                  <p className="text-sm text-muted-foreground">8 files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
