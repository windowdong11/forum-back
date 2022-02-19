import Post from "../models/Post"

const pickerThings = ['password', 'title', 'content', 'tags'] as const
type Put_UpdatePost_Req = Record<keyof Pick<Post, (typeof pickerThings)[number]>, string>
export default Put_UpdatePost_Req