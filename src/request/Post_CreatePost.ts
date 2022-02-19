import Post from "../models/Post"

const pickerThings = ['author', 'password', 'title', 'content', 'tags'] as const
type Post_CreatePost_Req = Record<keyof Pick<Post, (typeof pickerThings)[number]>, string>
export default Post_CreatePost_Req