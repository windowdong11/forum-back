import { ObjectId } from "mongodb"

export default interface Post {
    _id: ObjectId

    created_date: Date
    updated_date: Date

    author: string
    password: string
    title: string
    content: string
    tags: string[]
}