import Post from "../models/Post";
import { BaseJson_Res, PostImages_to_ImagesRes } from "./Base_Res";

const pickerThings = ['_id', 'author', 'title', 'content', 'comments', 'tags', 'created_date', 'updated_date'] as const
type ModifyPost_Item = Pick<Post, (typeof pickerThings)[number]> & {images: string[]}

export const Post_to_ModifyPost_Res = (post: Post) => {
  return {
    ...pickerThings.reduce((prev, cur) => ({...prev, [cur] : post[cur]}), {}),
    images : PostImages_to_ImagesRes(post.images)
  } as ModifyPost_Item
}
export default interface ModifyPost_Res extends BaseJson_Res {
  post: ModifyPost_Item
}