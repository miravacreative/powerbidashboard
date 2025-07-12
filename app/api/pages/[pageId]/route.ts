import { type NextRequest, NextResponse } from "next/server"

// Mock database - in a real app, this would be your actual database
const mockPages = [
  {
    id: "1",
    title: "Home Dashboard",
    content: {
      layout: "grid",
      sections: [
        {
          id: "welcome",
          type: "text",
          content: "Welcome to your dashboard",
          styles: { fontSize: "24px", color: "#333" },
        },
        {
          id: "stats",
          type: "stats",
          content: { orders: 150, revenue: "$12,500" },
          styles: { background: "#f5f5f5" },
        },
      ],
    },
    userId: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function PUT(request: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const { pageId } = params
    const body = await request.json()

    // Find the page to update
    const pageIndex = mockPages.findIndex((page) => page.id === pageId)

    if (pageIndex === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    // Update the page
    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      page: mockPages[pageIndex],
    })
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const { pageId } = params

    const page = mockPages.find((page) => page.id === pageId)

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error("Error fetching page:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}
