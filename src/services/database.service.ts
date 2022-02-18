// External Dependencies

// import * as dotenv from 'dotenv'
import { Collection, MongoClient } from 'mongodb';
import Post from '../models/Post';
import Comment from '../models/Comment';

// Global Variables
export interface Collections {
    post: Collection<Post>
    comment: Collection<Comment>
}

// Initialize Connection

export async function connectToDatabase() {
    // dotenv.config()

    // const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING)
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()

    const db = client.db('test')

    const collections : Collections = {
        post: db.collection('post'),
        comment: db.collection('comment')
    }

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${Object.keys(collections).map((key) => collections[key as keyof Collections]?.collectionName)}`);
    return {
        db,
        collections
    };
}