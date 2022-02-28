import Comment from "../models/Comment"

type Post_EditComment_Req = Pick<Comment, 'password' | 'content'>
export default Post_EditComment_Req