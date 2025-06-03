"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import UploadForm from "@/components/upload-form"
import DocumentTable from "@/components/document-table"
import { initializeDb, getDocuments, addDocument } from "@/lib/document-service"
import type { Document } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KnowledgeSystem() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await initializeDb()
      const docs = await getDocuments()
      setDocuments(docs)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleDocumentAdded = async (newDoc: Document) => {
    await addDocument(newDoc)
    setDocuments(await getDocuments())
    setShowUploadForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Repository</h1>
          <Button onClick={() => setShowUploadForm(!showUploadForm)}>
            {showUploadForm ? "Cancel Upload" : "Upload Document"}
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {showUploadForm && (
              <div className="mb-6">
                <UploadForm onDocumentAdded={handleDocumentAdded} />
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-10">Loading documents...</div>
            ) : (
              <DocumentTable
                documents={documents}
                onDocumentsChanged={async () => setDocuments(await getDocuments())}
              />
            )}
          </TabsContent>
          <TabsContent value="recent">
            {showUploadForm && (
              <div className="mb-6">
                <UploadForm onDocumentAdded={handleDocumentAdded} />
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-10">Loading documents...</div>
            ) : (
              <DocumentTable
                documents={documents
                  .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                  .slice(0, 5)}
                onDocumentsChanged={async () => setDocuments(await getDocuments())}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
