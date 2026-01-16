import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Demo, Slide } from '@/types/demo';

// In-memory store fallback
const inMemoryStore: {
  demos: Map<string, Demo>;
  settings: Map<string, unknown>;
} = {
  demos: new Map(),
  settings: new Map(),
};

let client: MongoClient | null = null;
let db: Db | null = null;
let useInMemory = false;

interface MongoDemo extends Omit<Demo, 'id' | 'createdAt' | 'updatedAt'> {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export async function connectToDatabase(): Promise<Db | null> {
  const mongoUri = process.env.MONGODB_URI;

  // If no MongoDB URI, use in-memory store
  if (!mongoUri) {
    console.log('No MONGODB_URI found, using in-memory store');
    useInMemory = true;
    return null;
  }

  if (client && db) {
    return db;
  }

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'swift-demo');
    console.log('Connected to MongoDB');
    useInMemory = false;
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB, falling back to in-memory store:', error);
    useInMemory = true;
    return null;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// Demo CRUD operations
export async function getDemos(): Promise<Demo[]> {
  await connectToDatabase();

  if (useInMemory) {
    return Array.from(inMemoryStore.demos.values());
  }

  const collection = db!.collection<MongoDemo>('demos');
  const demos = await collection.find({}).sort({ createdAt: -1 }).toArray();

  return demos.map((doc) => ({
    ...doc,
    id: doc._id!.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

export async function getDemoById(id: string): Promise<Demo | null> {
  await connectToDatabase();

  if (useInMemory) {
    return inMemoryStore.demos.get(id) || null;
  }

  try {
    const collection = db!.collection<MongoDemo>('demos');
    const doc = await collection.findOne({ _id: new ObjectId(id) });

    if (!doc) return null;

    return {
      ...doc,
      id: doc._id!.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  } catch {
    return null;
  }
}

export async function createDemo(demo: Omit<Demo, 'id' | 'createdAt'>): Promise<Demo> {
  await connectToDatabase();

  const newDemo: Demo = {
    ...demo,
    id: useInMemory ? generateId() : '',
    createdAt: new Date(),
  };

  if (useInMemory) {
    inMemoryStore.demos.set(newDemo.id, newDemo);
    return newDemo;
  }

  const collection = db!.collection<MongoDemo>('demos');
  const result = await collection.insertOne({
    ...demo,
    createdAt: new Date(),
  });

  return {
    ...newDemo,
    id: result.insertedId.toString(),
  };
}

export async function updateDemo(id: string, updates: Partial<Demo>): Promise<Demo | null> {
  await connectToDatabase();

  if (useInMemory) {
    const existing = inMemoryStore.demos.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    inMemoryStore.demos.set(id, updated);
    return updated;
  }

  const collection = db!.collection<MongoDemo>('demos');
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) return null;

  return {
    ...result,
    id: result._id!.toString(),
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function deleteDemo(id: string): Promise<boolean> {
  await connectToDatabase();

  if (useInMemory) {
    return inMemoryStore.demos.delete(id);
  }

  const collection = db!.collection<MongoDemo>('demos');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// Settings operations
export async function getSetting<T>(key: string): Promise<T | null> {
  await connectToDatabase();

  if (useInMemory) {
    return (inMemoryStore.settings.get(key) as T) || null;
  }

  const collection = db!.collection('settings');
  const doc = await collection.findOne({ key });
  return doc?.value || null;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  await connectToDatabase();

  if (useInMemory) {
    inMemoryStore.settings.set(key, value);
    return;
  }

  const collection = db!.collection('settings');
  await collection.updateOne(
    { key },
    { $set: { key, value, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Utility functions
function generateId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initialize with demo data if empty
export async function seedDemoData(demos: Demo[]): Promise<void> {
  await connectToDatabase();

  const existingDemos = await getDemos();
  if (existingDemos.length === 0) {
    console.log('Seeding demo data...');
    for (const demo of demos) {
      await createDemo(demo);
    }
    console.log(`Seeded ${demos.length} demos`);
  }
}

// Export store type for debugging
export function getStoreStatus(): { useInMemory: boolean; connected: boolean } {
  return {
    useInMemory,
    connected: !!db,
  };
}
