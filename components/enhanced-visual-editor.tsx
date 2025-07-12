"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, Type, ImageIcon, BarChart3, Layout, Save, Undo, Redo, Eye } from "lucide-react"

interface Section {
  id: string
  type: "text" | "image" | "stats" | "chart" | "layout"
  content: any
  styles?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    background?: string
    padding?: string
    margin?: string
    textAlign?: string
  }
}

interface PageContent {
  layout: string
  sections: Section[]
}

interface EnhancedVisualEditorProps {
  initialContent?: PageContent
  onChange?: (content: PageContent) => void
  autoSave?: boolean
}

export function EnhancedVisualEditor({ initialContent, onChange, autoSave = false }: EnhancedVisualEditorProps) {
  const [content, setContent] = useState<PageContent>(
    initialContent || {
      layout: "grid",
      sections: [],
    },
  )
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [history, setHistory] = useState<PageContent[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onChange) {
      const timeoutId = setTimeout(() => {
        onChange(content)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [content, autoSave, onChange])

  // History management
  const addToHistory = useCallback(
    (newContent: PageContent) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }

  const updateContent = (newContent: PageContent) => {
    setContent(newContent)
    addToHistory(newContent)
    if (onChange && !autoSave) {
      onChange(newContent)
    }
  }

  const addSection = (type: Section["type"]) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    }

    const newContent = {
      ...content,
      sections: [...content.sections, newSection],
    }
    updateContent(newContent)
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const newContent = {
      ...content,
      sections: content.sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)),
    }
    updateContent(newContent)
  }

  const deleteSection = (sectionId: string) => {
    const newContent = {
      ...content,
      sections: content.sections.filter((section) => section.id !== sectionId),
    }
    updateContent(newContent)
  }

  const getDefaultContent = (type: Section["type"]) => {
    switch (type) {
      case "text":
        return "Enter your text here..."
      case "image":
        return { src: "/placeholder.svg?height=200&width=400", alt: "Placeholder image" }
      case "stats":
        return { title: "Statistics", value: "0", description: "Description" }
      case "chart":
        return { type: "bar", data: [] }
      case "layout":
        return { columns: 2, gap: "1rem" }
      default:
        return ""
    }
  }

  const getDefaultStyles = (type: Section["type"]) => {
    switch (type) {
      case "text":
        return { fontSize: "16px", color: "#333333", textAlign: "left" }
      case "stats":
        return { background: "#f8f9fa", padding: "1rem", textAlign: "center" }
      default:
        return {}
    }
  }

  const renderSectionEditor = (section: Section) => {
    switch (section.type) {
      case "text":
        return (
          <div className="space-y-4">
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter text content..."
              rows={4}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Font Size</label>
                <Input
                  value={section.styles?.fontSize || "16px"}
                  onChange={(e) =>
                    updateSection(section.id, {
                      styles: { ...section.styles, fontSize: e.target.value },
                    })
                  }
                  placeholder="16px"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={section.styles?.color || "#333333"}
                  onChange={(e) =>
                    updateSection(section.id, {
                      styles: { ...section.styles, color: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )

      case "stats":
        return (
          <div className="space-y-4">
            <Input
              value={section.content.title || ""}
              onChange={(e) =>
                updateSection(section.id, {
                  content: { ...section.content, title: e.target.value },
                })
              }
              placeholder="Statistics Title"
            />
            <Input
              value={section.content.value || ""}
              onChange={(e) =>
                updateSection(section.id, {
                  content: { ...section.content, value: e.target.value },
                })
              }
              placeholder="Value"
            />
            <Input
              value={section.content.description || ""}
              onChange={(e) =>
                updateSection(section.id, {
                  content: { ...section.content, description: e.target.value },
                })
              }
              placeholder="Description"
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <Input
              value={section.content.src || ""}
              onChange={(e) =>
                updateSection(section.id, {
                  content: { ...section.content, src: e.target.value },
                })
              }
              placeholder="Image URL"
            />
            <Input
              value={section.content.alt || ""}
              onChange={(e) =>
                updateSection(section.id, {
                  content: { ...section.content, alt: e.target.value },
                })
              }
              placeholder="Alt text"
            />
          </div>
        )

      default:
        return <p className="text-muted-foreground">No editor available for this section type.</p>
    }
  }

  const renderSectionPreview = (section: Section) => {
    switch (section.type) {
      case "text":
        return (
          <div style={section.styles} className="p-4 border rounded-lg">
            {section.content}
          </div>
        )

      case "stats":
        return (
          <div style={section.styles} className="p-4 border rounded-lg text-center">
            <h3 className="text-lg font-semibold">{section.content.title}</h3>
            <p className="text-2xl font-bold text-blue-600">{section.content.value}</p>
            <p className="text-sm text-muted-foreground">{section.content.description}</p>
          </div>
        )

      case "image":
        return (
          <div className="p-4 border rounded-lg">
            <img
              src={section.content.src || "/placeholder.svg"}
              alt={section.content.alt}
              className="w-full h-auto rounded"
            />
          </div>
        )

      default:
        return (
          <div className="p-4 border rounded-lg bg-muted">
            <p className="text-muted-foreground">Unknown section type: {section.type}</p>
          </div>
        )
    }
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview Mode</h3>
          <Button onClick={() => setPreviewMode(false)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Exit Preview
          </Button>
        </div>
        <div className="space-y-4">
          {content.sections.map((section) => (
            <div key={section.id}>{renderSectionPreview(section)}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="outline" size="sm" onClick={() => addSection("text")}>
            <Type className="w-4 h-4 mr-2" />
            Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("image")}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("stats")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Stats
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          {!autoSave && (
            <Button size="sm" onClick={() => onChange?.(content)}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {content.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSection === section.id ? "border-blue-500 bg-blue-50" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {section.type === "text" && <Type className="w-4 h-4" />}
                        {section.type === "image" && <ImageIcon className="w-4 h-4" />}
                        {section.type === "stats" && <BarChart3 className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {section.type.charAt(0).toUpperCase() + section.type.slice(1)} {index + 1}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSection(section.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {content.sections.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sections added yet. Use the toolbar to add content.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Editor */}
        <div className="lg:col-span-2">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Edit {content.sections.find((s) => s.id === selectedSection)?.type} Section
                </CardTitle>
              </CardHeader>
              <CardContent>{renderSectionEditor(content.sections.find((s) => s.id === selectedSection)!)}</CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Layout className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Section to Edit</h3>
                <p className="text-muted-foreground">
                  Choose a section from the left panel or add a new one using the toolbar above.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Live Preview */}
      {content.sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.sections.map((section) => (
                <div key={section.id} className="relative group">
                  {renderSectionPreview(section)}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="text-xs">
                      {section.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
