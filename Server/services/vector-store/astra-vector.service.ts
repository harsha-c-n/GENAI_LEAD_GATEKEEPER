import { DataAPIClient } from '@datastax/astra-db-ts';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });
// type SimilarityMetric = "dot_product" |"cosine"|"euclidean";
class AstraVectorStore {
  private client: DataAPIClient;
  private endpoint: string;

  constructor() {
    this.client = new DataAPIClient(process.env.ASTRA_DB_TOKEN);
    this.endpoint = process.env.ASTRA_DB_ENDPOINT || 'default_keyspace';
  }



  async upsertVectors(chunk: string, vector: any[]) {
    const db = this.client.db(this.endpoint!,{namespace:'default_keyspace'});
    const vectorCollection = db.collection('gendb');

    const res= await vectorCollection.insertOne({
      $vector:vector,
      text:chunk
    })
  }

  

  async similaritySearch(collection: string, queryVector: number[], k = 5) {
    const db = this.client.db(this.endpoint);
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
    const db = this.client.db(this.endpoint);
    return db.createCollection(collection, options);
  }

  async deleteCollection(collection: string) {
    const db = this.client.db(this.endpoint);
    return db.dropCollection(collection);
  }
}

export default AstraVectorStore;