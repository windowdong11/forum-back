import Post from "../models/Post";
import { BaseJson_Res } from "./Base_Res";

const pickerThings = ['author', 'title', 'content', 'comments', 'tags','created_date', 'updated_date'] as const


type PostResPicker = (typeof pickerThings)[number]
type PostResItem = Pick<Post, PostResPicker> & {images: string[]}

export const PostToPostResItem = (post: Post) => {
  return {
    ...pickerThings.reduce((prev, cur) => ({...prev, [cur] : post[cur]}), {}),
    images : post.images.map(image => image.path)
  } as PostResItem
}
export default interface Get_Post_Res extends BaseJson_Res {
  post: PostResItem
}