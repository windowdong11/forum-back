import express, { Request, RequestHandler } from 'express'
import cors from 'cors'
import multer from 'multer'
import { MongoClient, Collection, ObjectId, WithId } from 'mongodb';
import assert from 'assert'
import { Collections, connectToDatabase } from './services/database.service';
import Post from './models/Post';
import { Get_PostList_Res, PostToPostListItem } from './response/Get_PostList';
import { BaseJson_Res } from './response/Base_Res';
import Get_Post_Res, { PostToPostResItem } from './response/Get_Post';
import whitelist from './whitelist.json'
import path from 'path';
import e from 'express';

connectToDatabase().then(
  ({db, collections}) => {
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
      console.log('Get post list')
      const posts = (await collections.post.find({}).toArray()).map(post => (PostToPostListItem(post)))
      res.status(200).send({
        success: true,
        posts : posts
      } as Get_PostList_Res)
    })
    
    
    
    app.get('/post/:postid', async (req, res) => {
      console.log(`get post : ${req.params.postid}`)
      try {
        collections.post.findOne({ _id: new ObjectId(req.params.postid) })
          .then(post => {
            if (post)
              res.status(200).send({
                success: true,
                post : PostToPostResItem(post)
              } as Get_Post_Res)
            else
              res.send(404)
          })
      } catch (error) {
        res.send(404)
      }
    })
    
    interface CreatePost_Data {
      author: string
      password: string
      title: string
      content: string
      tags: string
    }
    
    app.post('/post/create', upload.array('images', 3), async (req: Request<{}, {}, CreatePost_Data>, res) => {
      const post_id = new ObjectId()
      
      console.log(`Create new post, ${post_id}`)
    
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
      return res.send({
        success: true,
        post: PostToPostResItem(newPost)
      } as Get_Post_Res)
    })
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }
)