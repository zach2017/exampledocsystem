export interface Document {
  id: string
  name: string
  type: string
  size: number
  subject: string
  keywords: string[]
  description?: string
  uploadDate: string
  url: string
}
