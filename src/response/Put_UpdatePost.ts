import Post from "../models/Post";
import { BaseJson_Res, PostImages_to_ImagesRes } from "./Base_Res";

const pickerThings = ['_id', 'author', 'title', 'content', 'comments', 'tags', 'created_date', 'updated_date'] as const
type UpdatePostResItem = Pick<Post, (typeof pickerThings)[number]> & {images: string[]}

export const PostToUpdatePostResItem = (post: Post) => {
  return {
    ...pickerThings.reduce((prev, cur) => ({...prev, [cur] : post[cur]}), {}),
    images : PostImages_to_ImagesRes(post.images)
  } as UpdatePostResItem
}
export default interface Put_UpdatePost_Res extends BaseJson_Res {
  post: UpdatePostResItem
}