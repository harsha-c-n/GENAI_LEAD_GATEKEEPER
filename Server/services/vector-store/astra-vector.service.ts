import { DataAPIClient } from '@datastax/astra-db-ts';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

class AstraVectorStore {
  private client: DataAPIClient;
  private namespace: string;

  constructor() {
    this.client = new DataAPIClient(process.env.ASTRA_DB_TOKEN);
    this.namespace = process.env.ASTRA_DB_NAMESPACE || 'default_namespace';
  }

  async upsertVectors(collection: string, documents: any[]) {
    const db = this.client.db(this.namespace);
    const vectorCollection = db.collection(collection);

    const upsertOperations = documents.map(doc => 
      vectorCollection.insertOne({
        ...doc,
        $vector: doc.embedding
      })
    );

    return Promise.all(upsertOperations);
  }

  async similaritySearch(collection: string, queryVector: number[], k = 5) {
    const db = this.client.db(this.namespace);
    const vectorCollection = db.collection(collection);
  
    return vectorCollection.find(
      // Empty filter to match all documents
      {}, 
      {
        // Sort by vector similarity
        sort: { $vector: queryVector },
        // Limit results
        limit: k
      }
    ).toArray();
  }

  async createCollection(collection: string, options?: any) {
    const db = this.client.db(this.namespace);
    return db.createCollection(collection, options);
  }

  async deleteCollection(collection: string) {
    const db = this.client.db(this.namespace);
    return db.dropCollection(collection);
  }
}

export default AstraVectorStore;