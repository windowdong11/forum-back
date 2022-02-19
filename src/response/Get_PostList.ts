import Post from "../models/Post"
import { BaseJson_Res } from './Base_Res';

const pickerThings = ['_id', 'author', 'title', 'updated_date', 'tags'] as const


type PostItemPicker = (typeof pickerThings)[number]
type PostListItem = Pick<Post, PostItemPicker>

export const PostToPostListItem = (post: Post) => {
  return pickerThings.reduce((prev, cur) => ({...prev, [cur] : post[cur]}), {}) as PostListItem
}

export interface Get_PostList_Res extends BaseJson_Res {
  posts: PostListItem[]
}