import Comment from "../models/Comment"

type Post_CreateComment_Req = Pick<Comment, 'author' | 'password' | 'content'>
export default Post_CreateComment_Req