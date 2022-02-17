import express, { Request } from 'express'
import cors from 'cors'
import multer from 'multer'
import { MongoClient, Collection, ObjectId } from 'mongodb';
import assert from 'assert'
import { Collections, collections, connectToDatabase } from './services/database.service';
import Post from './models/Post';
import { Get_PostList_Res } from './response/Get_PostList';
import { BaseJson_Res } from './response/Base_Res';
import Get_Post_Res from './response/Get_Post';
import whitelist from './whitelist.json'
import path from 'path';

const app = express();
const port = 5500

const corsOptions: cors.CorsOptions = {
  origin: whitelist
}

app.use(cors(corsOptions))
app.use('/image', express.static(path.join(__dirname, '../uploads')))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})


const upload = multer({
  storage
})


app.get('/', async (req, res) => {
  if (!collections.post)
    throw new Error('Collection "Post" does not match.')
  console.log('Get post list')
  const posts = await collections.post.find({}).toArray()
  res.status(200).send({
    success: true,
    posts: posts.map(post => {
      return {
        ...post
      }
    })
  } as BaseJson_Res & Get_PostList_Res)
})



app.get('/post/:postid', async (req, res) => {
  console.log(`get post : ${req.params.postid}`)
  if (!collections.post)
    throw new Error('Collection "Post" does not match.')
  try {
    collections.post.findOne({ _id: new ObjectId(req.params.postid) })
      .then(post => {
        if (post)
          res.status(200).send({
            success: true,
            post
          } as BaseJson_Res & Get_Post_Res)
        else
          res.status(200).send({
            success: false,
            post
          } as BaseJson_Res & Get_Post_Res)
      })
  } catch (error) {
    res.status(200).send({
      success: false,
      post: null
    } as BaseJson_Res & Get_Post_Res)
  }
})

interface CreatePost_Data {
  author: string
  password: string
  title: string
  content: string
  tags: string
}

app.post('/', upload.array('images', 3), async (req: Request<{}, {}, CreatePost_Data>, res) => {
  if (!collections.post)
    throw new Error('Collection "Board" does not match.')
  if (!collections.comment)
    throw new Error('Collection "Comment" does not match.')
  
  console.log('Post post')
  console.log(req.files)

  const post_id = new ObjectId()
  const newPost = {
    ...req.body,
    images : (req.files ? req.files as Express.Multer.File[] : []),
    tags: (req.body.tags.length ? req.body.tags.split(' ') : []),
    comments: [],
    created_date: new Date(),
    updated_date: new Date(),
    _id: post_id
  }
  collections.post.insertOne(newPost)
  return res.status(200).send({
    success: true,
    post: newPost
  } as BaseJson_Res & Get_Post_Res)
})

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})