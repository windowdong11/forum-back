import { ObjectId } from "mongodb"
import Comment from './Comment';

export default interface Post {
    _id: ObjectId
    comments: Comment[]

    created_date: Date
    updated_date: Date

    author: string
    password: string
    title: string
    content: string
    images: Express.Multer.File[]
    tags: string[]
}