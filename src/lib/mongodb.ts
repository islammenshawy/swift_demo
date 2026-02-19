import { MongoClient, Db, ObjectId } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, create a new client for each request
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}

export async function getCollection<T extends object>(name: string) {
  const db = await getDatabase()
  return db.collection<T>(name)
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  PRESENTATIONS: 'presentations',
  CHAT_HISTORY: 'chatHistory',
  TEMPLATES: 'templates',
  GENERATED_SLIDES: 'generatedSlides',
} as const

// Helper to convert string ID to ObjectId
export function toObjectId(id: string | ObjectId): ObjectId {
  if (id instanceof ObjectId) return id
  return new ObjectId(id)
}

// Helper to convert ObjectId to string
export function toStringId(id: ObjectId | string): string {
  if (typeof id === 'string') return id
  return id.toString()
}

export { clientPromise, ObjectId }
