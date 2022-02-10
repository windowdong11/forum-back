import Post from "../models/Post"

type PostItem = Pick<Post,
'_id' | 'author' | 'title' | 'updated_date' | 'tags'
>

export interface Get_PostList_Res {
  posts: PostItem[]
}