import { ObjectId } from "mongodb"

export default interface Comment {
    _id: ObjectId
    children?: Comment['_id'][]

    author: string
    password: string
    images: Express.Multer.File[]
    
    created_date: Date
    updated_date: Date

    content: string
}