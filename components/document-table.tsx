"use client"

import { useState } from "react"
import { DownloadIcon, Eye, FileEdit, Share2, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Document } from "@/lib/types"
import { deleteDocument } from "@/lib/document-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DocumentTableProps {
  documents: Document[]
  onDocumentsChanged: () => void
}

type SortField = "name" | "uploadDate" | "subject" | "keywords"
type SortDirection = "asc" | "desc"

export default function DocumentTable({ documents, onDocumentsChanged }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>("uploadDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewDocument, setViewDocument] = useState<Document | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedDocuments = [...documents].sort((a, b) => {
    let comparison = 0

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === "uploadDate") {
      comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
    } else if (sortField === "subject") {
      comparison = a.subject.localeCompare(b.subject)
    } else if (sortField === "keywords") {
      comparison = a.keywords.join(",").localeCompare(b.keywords.join(","))
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id)
      onDocumentsChanged()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleView = (doc: Document) => {
    setViewDocument(doc)
  }

  const handleDownload = (doc: Document) => {
    // In a real app, this would download the actual file
    // For this demo, we'll just open the URL in a new tab
    window.open(doc.url, "_blank")
  }

  const handleShare = (doc: Document) => {
    // In a real app, this would open a sharing dialog
    // For this demo, we'll just copy a fake URL to clipboard
    const shareUrl = `https://knowledge-system.example/share/${doc.id}`
    navigator.clipboard.writeText(shareUrl)
    alert(`Share link copied to clipboard: ${shareUrl}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Document Name
                {sortField === "name" && (
                  <span className="ml-2 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("uploadDate")}>
                Upload Date
                {sortField === "uploadDate" && (
                  <span className="ml-2 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("subject")}>
                Subject
                {sortField === "subject" && (
                  <span className="ml-2 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("keywords")}>
                Keywords
                {sortField === "keywords" && (
                  <span className="ml-2 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No documents found. Upload a document to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(doc)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(doc)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                  <TableCell>{doc.subject}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.keywords.map((keyword, i) => (
                        <Badge key={i} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        {viewDocument && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewDocument.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Subject</h3>
                <p>{viewDocument.subject}</p>
              </div>
              {viewDocument.description && (
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{viewDocument.description}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium">Keywords</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewDocument.keywords.map((keyword, i) => (
                    <Badge key={i} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">File Details</h3>
                <p>Type: {viewDocument.type || "Unknown"}</p>
                <p>Size: {(viewDocument.size / 1024).toFixed(2)} KB</p>
                <p>Uploaded: {formatDate(viewDocument.uploadDate)}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDocument(null)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(viewDocument)}>Download</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
