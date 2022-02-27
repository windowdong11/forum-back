import { CommentResult } from "../models/Comment";
import Post from "../models/Post";
import { BaseJson_Res, FileImage_to_ImageSource } from "./Base_Res";

const pickerThings = ['_id', 'author', 'title', 'content', 'comments', 'tags', 'created_date', 'updated_date'] as const
type ModifyPost_Item = Pick<Post, (typeof pickerThings)[number]> & {images: string[]} & {comments: CommentResult[]}

export const Post_to_ModifyPost_Res = (post: Post) => {
  return {
    ...pickerThings.reduce((prev, cur) => ({...prev, [cur] : post[cur]}), {}),
    images : FileImage_to_ImageSource(post.images),
    comments: post.comments.map(comment => ({
      _id: comment._id ,
      author: comment.author,
      content: comment.content,
      images: FileImage_to_ImageSource(comment.images),
      children: (comment.children ? comment.children.map(child => ({
        _id: child._id,
        author: child.author,
        content: child.content,
        images: FileImage_to_ImageSource(child.images),
      })) : []),
    }))
  } as ModifyPost_Item
}
export default interface ModifyPost_Res extends BaseJson_Res {
  post: ModifyPost_Item
}