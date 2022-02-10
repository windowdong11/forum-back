import express, { Request } from 'express'
import cors from 'cors'
// import multiparty, { File, Part } from 'multiparty'
import multer from 'multer'
import { MongoClient, Collection, ObjectId } from 'mongodb';
import assert from 'assert'
import { Collections, collections, connectToDatabase } from './services/database.service';
import Post from './models/Post';
import { Get_PostList_Res } from './response/Get_PostList';
import { BaseJson_Res } from './response/Base_Res';
import Get_Post_Res from './response/Get_Post';

const app = express();
const port = 5500

const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

app.use('/uploads', express.static('src/uploads'))

// const upload = multer({dest: 'uploads/'})
const upload = multer({
  storage
})


app.get('/', async (req, res) => {
  if(!collections.board)
    throw new Error('Collection "Board" does not match.')
  console.log('Get post list')
  const posts = await collections.board.find({}).toArray()
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
  if(!collections.board)
    throw new Error('Collection "Board" does not match.')
  try {
    collections.board.findOne({_id: new ObjectId(req.params.postid)})
    .then(post => {
      if(post)
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

app.get('/image/:postid', async (req, res) => {
  if(!collections.file)
    throw new Error('Collection "File" does not match.')
  const files = await collections.file.find({board_id: new ObjectId(req.params.postid)})
})

interface CreatePost_Data {
  author: string
  password: string
  title: string
  content: string
  tags: string
}

app.post('/', upload.array('images', 3), async (req : Request<{}, {}, CreatePost_Data>, res) => {
  // console.log('params => ', req.params)
  if(!collections.board)
    throw new Error('Collection "Board" does not match.')
  if(!collections.comment)
    throw new Error('Collection "Comment" does not match.')
  if(!collections.file)
    throw new Error('Collection "File" does not match.')
  
  // if(!req.body.author)
  //   throw new Error('Author not defined.')
  // if(!req.body.password)
  //   throw new Error('Password not defined.')
  // if(!req.body.title)
  //   throw new Error('Title not defined.')
  // if(!req.body.content)
  //   throw new Error('Text content not defined.')
  console.log('Post post')

  const board_id = new ObjectId()
  collections.board.insertOne({
    author: req.body.author,
    password: req.body.password,
    title: req.body.title,
    tags: (req.body.tags.length ? req.body.tags.split(' ') : []),
    content: req.body.content,
    created_date: new Date(),
    updated_date: new Date(),
    _id : board_id
  })
  if(req.files?.length)
    collections.file.insertMany(
      (req.files as Express.Multer.File[]).map(file => {
        return {
          ...file,
          _id: new ObjectId(),
          board_id
        }
      })
    )
  return res.status(200).send()
})

connectToDatabase().then(() =>{
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})