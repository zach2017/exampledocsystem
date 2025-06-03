"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Document } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface UploadFormProps {
  onDocumentAdded: (document: Document) => void
}

export default function UploadForm({ onDocumentAdded }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [subject, setSubject] = useState("")
  const [keywords, setKeywords] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !subject) return

    setIsSubmitting(true)

    try {
      // In a real app, you would upload the file to a server
      // Here we'll just create a document object with the file metadata
      const newDocument: Document = {
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        subject,
        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
        description,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file), // This URL will only work in the current session
      }

      onDocumentAdded(newDocument)

      // Reset form
      setFile(null)
      setSubject("")
      setKeywords("")
      setDescription("")
    } catch (error) {
      console.error("Error adding document:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Document</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Document File</Label>
            <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Marketing, Finance, HR"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. report, quarterly, analysis"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
