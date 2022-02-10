import { ObjectId } from "mongodb"
import Post from './Post';

export default interface Comment {
    _id: ObjectId
    board_id: Post['_id']
    parent_id?: Comment['_id']

    created_date: Date
    updated_date: Date

    text_content: string
}