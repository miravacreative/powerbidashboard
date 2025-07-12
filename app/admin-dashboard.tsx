"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserCreationModal } from "@/components/user-creation-modal"
import { PageCreationModal } from "@/components/page-creation-modal"
import { PageEditModal } from "@/components/page-edit-modal"
import { UserSettingsModal } from "@/components/user-settings-modal"
import { PageViewer } from "@/components/page-viewer"
import { UserDashboardEditor } from "@/components/user-dashboard-editor"
import type { User, Page, ActivityLog } from "@/lib/auth"
import {
  getAllUsers,
  getAllPages,
  getDashboardStats,
  getActivityLogs,
  updateUserStatus,
  deleteUser,
  deletePage,
  getUserById,
  getPageById,
} from "@/lib/auth"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  UserPlus,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Activity,
  TrendingUp,
  Clock,
  Settings,
  Globe,
  ArrowLeft,
} from "lucide-react"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

type AdminPage =
  | "dashboard"
  | "users"
  | "pages"
  | "user-detail"
  | "page-detail"
  | "page-view"
  | "user-pages"
  | "user-page-view"

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard")
  const [users, setUsers] = useState<User[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<any>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPageModal, setShowPageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [viewingPage, setViewingPage] = useState<Page | null>(null)
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false)
  const [selectedUserForSettings, setSelectedUserForSettings] = useState<User | null>(null)
  const [viewingUserPage, setViewingUserPage] = useState<{ user: User; page: Page } | null>(null)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setUsers(getAllUsers())
    setPages(getAllPages())
    setActivities(getActivityLogs(20))
    setStats(getDashboardStats())
  }

  const handleUserStatusToggle = (userId: string, currentStatus: boolean) => {
    updateUserStatus(userId, !currentStatus)
    loadData()
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
      loadData()
    }
  }

  const handleDeletePage = (pageId: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deletePage(pageId, user.id)
      loadData()
    }
  }

  const handleViewUser = (userId: string) => {
    const userData = getUserById(userId)
    setSelectedUser(userData)
    setCurrentPage("user-detail")
  }

  const handleViewPage = (pageId: string) => {
    const pageData = getPageById(pageId)
    setSelectedPage(pageData)
    setCurrentPage("page-detail")
  }

  const handleEditPage = (pageData: Page) => {
    setSelectedPage(pageData)
    setShowEditModal(true)
  }

  const handleViewPageContent = (page: Page) => {
    setViewingPage(page)
    setCurrentPage("page-view")
  }

  const handleUserSettings = (userData: User) => {
    setSelectedUserForSettings(userData)
    setShowUserSettingsModal(true)
  }

  const handleViewUserPage = (userData: User, page: Page) => {
    setViewingUserPage({ user: userData, page })
    setCurrentPage("user-page-view")
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "pages", label: "Page Management", icon: FileText },
    { id: "user-pages", label: "User Pages", icon: BarChart3 },
  ]

  const sidebar = (
    <nav className="px-4 space-y-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as AdminPage)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.id
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Users",
                  value: stats.totalUsers || 0,
                  icon: Users,
                  color: "bg-blue-500",
                  change: `+${stats.recentRegistrations || 0} this month`,
                },
                {
                  title: "Active Users",
                  value: stats.activeUsers || 0,
                  icon: UserPlus,
                  color: "bg-green-500",
                  change: `${Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% active`,
                },
                {
                  title: "Total Pages",
                  value: stats.totalPages || 0,
                  icon: FileText,
                  color: "bg-purple-500",
                  change: `${stats.activePages || 0} active`,
                },
                {
                  title: "Daily Traffic",
                  value: stats.dailyTraffic || 0,
                  icon: BarChart3,
                  color: "bg-orange-500",
                  change: `${stats.monthlyTraffic || 0} this month`,
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in hover:shadow-lg transition-shadow"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <TrendingUp size={14} />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities.map((activity) => {
                  const activityUser = users.find((u) => u.id === activity.userId)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-white">
                          <span className="font-medium">{activityUser?.name || "Unknown User"}</span> {activity.details}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} />
                          <span>{activity.timestamp.toLocaleString()}</span>
                          {activity.ipAddress && <span>• {activity.ipAddress}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{users.length} total users</span>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add User
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {users.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{userData.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{userData.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userData.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : userData.role === "developer"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userData.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {userData.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {userData.lastLogin ? userData.lastLogin.toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewUser(userData.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleUserSettings(userData)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="User Settings"
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            onClick={() => handleUserStatusToggle(userData.id, userData.isActive)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title={userData.isActive ? "Deactivate" : "Activate"}
                          >
                            {userData.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userData.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case "pages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Page Management</h2>
              <button
                onClick={() => setShowPageModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Create Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{page.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        page.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {page.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {page.type.toUpperCase()} • {page.subType?.toUpperCase()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{page.content}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Updated: {page.updatedAt.toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPageContent(page)}
                      className="flex-1 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => handleViewPage(page.id)}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditPage(page)}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "user-pages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Pages Overview</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">Monitor and manage user page access</div>
            </div>

            {/* User Pages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {users
                .filter((u) => u.role === "user")
                .map((userData) => (
                  <div
                    key={userData.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{userData.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userData.username}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          userData.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {userData.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Assigned Pages</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {userData.assignedPages?.length || 0}
                        </span>
                      </div>

                      {userData.assignedPages && userData.assignedPages.length > 0 ? (
                        <div className="space-y-2">
                          {userData.assignedPages.map((pageId) => {
                            const page = pages.find((p) => p.id === pageId)
                            if (!page) return null

                            return (
                              <div
                                key={pageId}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      page.type === "powerbi"
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                                        : page.type === "spreadsheet"
                                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                          : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                                    }`}
                                  >
                                    {page.type === "powerbi" ? (
                                      <BarChart3 size={14} />
                                    ) : page.type === "spreadsheet" ? (
                                      <FileText size={14} />
                                    ) : (
                                      <Globe size={14} />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 dark:text-white text-sm">{page.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {page.type.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleViewUserPage(userData, page)}
                                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm flex items-center gap-1"
                                  title="View as User"
                                >
                                  <Eye size={12} />
                                  View
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No pages assigned</p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUserSettings(userData)}
                          className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
                        >
                          Manage Access
                        </button>
                        <button
                          onClick={() => handleViewUser(userData.id)}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {users.filter((u) => u.role === "user").length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Users Found</h3>
                <p className="text-gray-600 dark:text-gray-400">Create users to manage their page access.</p>
              </div>
            )}
          </div>
        )

      case "user-page-view":
        if (!viewingUserPage) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("user-pages")}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {viewingUserPage.user.name}'s View: {viewingUserPage.page.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Admin View • Read Only • {viewingUserPage.page.type.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                  Admin View Only
                </div>
              </div>
            </div>

            <PageViewer page={viewingUserPage.page} onBack={() => setCurrentPage("user-pages")} canEdit={false} />
          </div>
        )

      case "user-detail":
        if (!selectedUser) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Details</h2>
              <button
                onClick={() => setCurrentPage("users")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Users
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedUser.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {selectedUser.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedUser.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : selectedUser.role === "developer"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Assigned Pages</h3>
                  <div className="space-y-2">
                    {selectedUser.role === "user" ? (
                      selectedUser.assignedPages && selectedUser.assignedPages.length > 0 ? (
                        selectedUser.assignedPages.map((pageId) => {
                          const page = pages.find((p) => p.id === pageId)
                          return (
                            <div
                              key={pageId}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white">{page?.title || pageId}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{page?.type.toUpperCase()}</p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No pages assigned</p>
                      )
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        {selectedUser.role === "admin" ? "Admin" : "Developer"} has access to all pages
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "page-detail":
        if (!selectedPage) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Page Details</h2>
              <button
                onClick={() => setCurrentPage("pages")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Pages
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Page Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Title</label>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPage.title}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Type</label>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPage.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Sub Type</label>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {selectedPage.subType?.toUpperCase() || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Content</label>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPage.content}</p>
                    </div>
                    {selectedPage.embedUrl && (
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Embed URL</label>
                        <p className="font-medium text-gray-800 dark:text-white break-all">{selectedPage.embedUrl}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Page Preview</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-64">
                    {selectedPage.type === "html" && selectedPage.htmlContent ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedPage.htmlContent }} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            {selectedPage.type === "powerbi" ? (
                              <BarChart3 className="w-8 h-8 text-white" />
                            ) : (
                              <FileText className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedPage.type === "powerbi"
                              ? "Power BI Dashboard would be embedded here"
                              : "Spreadsheet would be embedded here"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "page-view":
        if (!viewingPage) return null

        if (viewingPage.type === "html" && viewingPage.htmlContent) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Page Content</h2>
                <button
                  onClick={() => setCurrentPage("pages")}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Pages
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div dangerouslySetInnerHTML={{ __html: viewingPage.htmlContent }} />
              </div>
            </div>
          )
        } else if (viewingPage.type === "powerbi" && viewingPage.embedUrl) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Page Content</h2>
                <button
                  onClick={() => setCurrentPage("pages")}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Pages
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <iframe
                  src={viewingPage.embedUrl}
                  title="Power BI Report"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Page Content</h2>
                <button
                  onClick={() => setCurrentPage("pages")}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Pages
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p>No content to display.</p>
              </div>
            </div>
          )
        }

      default:
        return null
    }
  }

  return (
    <>
      <DashboardLayout user={user} title="Admin - Dashboard Shipment JNE" sidebar={sidebar} onLogout={onLogout}>
        {renderContent()}
      </DashboardLayout>

      <UserCreationModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={() => {
          loadData()
          setShowUserModal(false)
        }}
      />

      <PageCreationModal
        isOpen={showPageModal}
        onClose={() => setShowPageModal(false)}
        onSuccess={() => {
          loadData()
          setShowPageModal(false)
        }}
        userId={user.id}
      />

      <PageEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          loadData()
          setShowEditModal(false)
        }}
        page={selectedPage}
        userId={user.id}
      />

      <UserSettingsModal
        isOpen={showUserSettingsModal}
        onClose={() => setShowUserSettingsModal(false)}
        onSuccess={() => {
          loadData()
          setShowUserSettingsModal(false)
        }}
        user={selectedUserForSettings}
      />
    </>
  )
}
