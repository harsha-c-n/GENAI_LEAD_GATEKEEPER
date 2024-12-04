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

  

  async similaritySearch(queryVector: any) {
    const db = this.client.db(this.endpoint);
    const vectorCollection = await db.collection('gendb');

    const cursor = vectorCollection.find({}, {
      sort: {
        $vector: queryVector.data[0].embedding,
      },
      limit: 10
    })
    const documents=await cursor.toArray()
    return documents;
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