import { ObjectId } from "mongodb"
import { FileImage_to_ImageSource } from "../response/Base_Res"
export default interface Comment{
    _id: ObjectId
    children: ChildComment[]

    author: string
    password: string
    images: Express.Multer.File[]
    
    created_date: Date
    updated_date: Date

    content: string
}

export interface ChildComment{
    _id: ObjectId

    author: string
    password: string
    images: Express.Multer.File[]
    
    created_date: Date
    updated_date: Date

    content: string
}

//! 모델 생각좀 더 해봐야 될만한 부분

const resultPicker = ['_id', 'author', 'content', 'created_date', 'updated_date', 'children'] as const
export interface CommentResult{
    _id: ObjectId
    children: ChildCommentResult[]

    author: string
    images: string[]
    
    created_date: Date
    updated_date: Date

    content: string
}

export interface ChildCommentResult{
    _id: ObjectId

    author: string
    images: string[]
    
    created_date: Date
    updated_date: Date

    content: string
}

export const Comment_to_CommentResult = (comment: Comment): CommentResult => {
    return {
        ...resultPicker.reduce((prev, cur) => ({ ...prev, [cur]: comment[cur] }), {}),
        images: FileImage_to_ImageSource(comment.images),
        children: comment.children.map(child => ({
            ...resultPicker.reduce((prev, cur) => {
                if(cur !== 'children') return {...prev, [cur]: child[cur]}
                else return prev
            }, {}),
            images: FileImage_to_ImageSource(child.images),
        }))
    } as CommentResult
}