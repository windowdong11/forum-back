// External Dependencies

// import * as dotenv from 'dotenv'
import { Collection, MongoClient } from 'mongodb';
import Post from '../models/Post';
import Comment from '../models/Comment';
import File from '../models/File';

// Global Variables
export interface Collections {
    board?: Collection<Post>
    comment?: Collection<Comment>
    file?: Collection<File>
}
export const collections: Collections = {}

// Initialize Connection

export async function connectToDatabase() {
    // dotenv.config()

    // const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING)
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()

    const db = client.db('test')

    collections.board = db.collection('board')
    collections.comment = db.collection('comment')
    collections.file = db.collection('file')

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${Object.keys(collections).map((key) => collections[key as keyof Collections]?.collectionName)}`);
    return db;
}