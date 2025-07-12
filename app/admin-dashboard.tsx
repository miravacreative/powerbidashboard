"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  Settings,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCreationModal } from "@/components/user-creation-modal"
import { UserSettingsModal } from "@/components/user-settings-modal"
import { RoleManagementModal } from "@/components/role-management-modal"
import { PageCreationModal } from "@/components/page-creation-modal"
import { PageEditModal } from "@/components/page-edit-modal"
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

interface Page {
  id: string
  title: string
  type: string
  status: "published" | "draft"
  createdAt: string
  author: string
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserCreation, setShowUserCreation] = useState(false)
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showRoleManagement, setShowRoleManagement] = useState(false)
  const [showPageCreation, setShowPageCreation] = useState(false)
  const [showPageEdit, setShowPageEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [viewingUserDashboard, setViewingUserDashboard] = useState<User | null>(null)

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "developer",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "editor",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "user",
      status: "inactive",
      lastLogin: "2024-01-14 03:45 PM",
    },
  ]

  const pages: Page[] = [
    {
      id: "1",
      title: "Home Dashboard",
      type: "dashboard",
      status: "published",
      createdAt: "2024-01-10",
      author: "Admin",
    },
    {
      id: "2",
      title: "User Profile",
      type: "profile",
      status: "draft",
      createdAt: "2024-01-12",
      author: "Jane Smith",
    },
    {
      id: "3",
      title: "Analytics Page",
      type: "analytics",
      status: "published",
      createdAt: "2024-01-14",
      author: "John Doe",
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

  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (viewingUserDashboard) {
    return <UserDashboardEditor user={viewingUserDashboard} currentUserRole="admin" onBack={handleBackFromUserView} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, pages, and system settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowUserCreation(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={() => setShowRoleManagement(true)}>
            <Shield className="w-4 h-4 mr-2" />
            Roles
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter((u) => u.status === "active").length / users.length) * 100)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">
              {pages.filter((p) => p.status === "published").length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="pages">Page Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages.slice(0, 3).map((page) => (
                    <div key={page.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {page.type} • {page.author}
                        </p>
                      </div>
                      <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
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
            <Button onClick={() => setShowUserCreation(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
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
                        Preview
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserSettings(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button onClick={() => setShowPageCreation(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Page Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{page.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.type} • Created by {page.author} on {page.createdAt}
                      </p>
                      <Badge variant={page.status === "published" ? "default" : "secondary"} className="mt-2">
                        {page.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPage(page)
                          setShowPageEdit(true)
                        }}
                      >
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

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings and configuration options will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showUserCreation && (
        <UserCreationModal
          isOpen={showUserCreation}
          onClose={() => setShowUserCreation(false)}
          onUserCreated={(user) => {
            console.log("User created:", user)
            setShowUserCreation(false)
          }}
        />
      )}

      {showUserSettings && selectedUser && (
        <UserSettingsModal
          isOpen={showUserSettings}
          onClose={() => {
            setShowUserSettings(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          onUserUpdated={(user) => {
            console.log("User updated:", user)
            setShowUserSettings(false)
            setSelectedUser(null)
          }}
        />
      )}

      {showRoleManagement && (
        <RoleManagementModal isOpen={showRoleManagement} onClose={() => setShowRoleManagement(false)} />
      )}

      {showPageCreation && (
        <PageCreationModal
          isOpen={showPageCreation}
          onClose={() => setShowPageCreation(false)}
          onPageCreated={(page) => {
            console.log("Page created:", page)
            setShowPageCreation(false)
          }}
        />
      )}

      {showPageEdit && selectedPage && (
        <PageEditModal
          isOpen={showPageEdit}
          onClose={() => {
            setShowPageEdit(false)
            setSelectedPage(null)
          }}
          page={selectedPage}
          onPageUpdated={(page) => {
            console.log("Page updated:", page)
            setShowPageEdit(false)
            setSelectedPage(null)
          }}
        />
      )}
    </div>
  )
}
