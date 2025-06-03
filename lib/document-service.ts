import type { Document } from "./types"
import { sampleDocuments } from "./sample-data"

const DB_NAME = "knowledge-system"
const STORE_NAME = "documents"
const DB_VERSION = 1

let db: IDBDatabase | null = null

export async function initializeDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve()
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("IndexedDB error:", event)
      reject("Could not open IndexedDB")
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      resolve()
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: "id" })
        objectStore.createIndex("uploadDate", "uploadDate", { unique: false })
        objectStore.createIndex("subject", "subject", { unique: false })
      }
    }
  })
}

export async function getDocuments(): Promise<Document[]> {
  await initializeDb()

  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      if (request.result.length === 0) {
        // If no documents exist, add sample data
        addSampleDocuments()
          .then(() => {
            // Get documents again after adding samples
            getDocuments().then(resolve).catch(reject)
          })
          .catch(reject)
      } else {
        resolve(request.result)
      }
    }

    request.onerror = (event) => {
      console.error("Error fetching documents:", event)
      reject("Could not fetch documents")
    }
  })
}

export async function addDocument(document: Document): Promise<void> {
  await initializeDb()

  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(document)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = (event) => {
      console.error("Error adding document:", event)
      reject("Could not add document")
    }
  })
}

export async function deleteDocument(id: string): Promise<void> {
  await initializeDb()

  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = (event) => {
      console.error("Error deleting document:", event)
      reject("Could not delete document")
    }
  })
}

async function addSampleDocuments(): Promise<void> {
  for (const doc of sampleDocuments) {
    await addDocument(doc)
  }
}
