import express, { Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import { ObjectId } from 'mongodb';
import { connectToDatabase } from './services/database.service';
import { Get_PostList_Res, PostToPostListItem } from './response/Get_PostList';
import Get_Post_Res, { PostToPostResItem } from './response/Get_Post';
import whitelist from './whitelist.json'
import path from 'path';
import Post_CreatePost_Req from './request/Post_CreatePost';
import Put_UpdatePost_Req from './request/Put_UpdatePost';
import ModifyPost_Res, { Post_to_ModifyPost_Res } from './response/Post_Modify';

connectToDatabase().then(
  ({ db, collections }) => {
    const app = express();
    const port = 5500

    const corsOptions: cors.CorsOptions = {
      origin: whitelist
    }

    app.use(cors(corsOptions))
    app.use('/image', express.static(path.join(__dirname, '../uploads')))
    app.use(express.json())

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

    app.get('/post/list', async (req, res) => {
      console.log('Get post list')
      const posts = (await collections.post.find({}).toArray()).map(post => (PostToPostListItem(post)))
      res.status(200).send({
        success: true,
        posts: posts
      } as Get_PostList_Res)
    })



    app.get('/post/:postid', async (req, res : Response<Get_Post_Res>) => {
      console.log(`get post : ${req.params.postid}`)
      try {
        collections.post.findOne({ _id: new ObjectId(req.params.postid) })
          .then(post => {
            if (post)
              res.status(200).send({
                success: true,
                post: PostToPostResItem(post)
              })
            else
              res.sendStatus(404)
          })
      } catch (error) {
        res.sendStatus(404)
      }
    })

    app.post('/post/create', upload.array('images', 3), async (req: Request<{}, {}, Post_CreatePost_Req>, res : Response<Get_Post_Res>) => {
      const post_id = new ObjectId()

      console.log(`Create new post, ${post_id}`)

      const newPost = {
        ...req.body,
        images: (req.files ? req.files as Express.Multer.File[] : []),
        tags: (req.body.tags.length ? req.body.tags.split(',') : []),
        comments: [],
        created_date: new Date(),
        updated_date: new Date(),
        _id: post_id
      }
      collections.post.insertOne(newPost)
      return res.send({
        success: true,
        post: PostToPostResItem(newPost)
      })
    })

    app.put('/post/edit/:postid', upload.array('images', 3), (req: Request<{ postid: string }, {}, Put_UpdatePost_Req>, res : Response<ModifyPost_Res>) => {
      console.log(`Update document, ${req.params.postid}`)
      console.log(req.body)
      collections.post.findOneAndUpdate({ _id: new ObjectId(req.params.postid), password: req.body.password }, {
        $set: {
          ...req.body,
          images: (req.files ? req.files as Express.Multer.File[] : []),
          tags: (req.body.tags.length ? req.body.tags.split(' ') : []),
          updated_date: new Date(),
        }
      }).then(upres => {
        if(upres.ok && upres.value)
          res.send({
            success: true,
            post: Post_to_ModifyPost_Res(upres.value)
          }).status(200)
        else res.sendStatus(404)
      })
    })

    app.delete('/post/delete/:postid', (req : Request<{ postid: string }, {}, {password: string}>, res : Response<ModifyPost_Res>) => {
      console.log(`Delete post, ${req.params.postid}`)
      if(!req.body || !req.body.password) {
        res.sendStatus(400)
        return
      }
      collections.post.findOneAndDelete({ _id: new ObjectId(req.params.postid), password: req.body.password})
        .then(modres => {
          if(modres.ok && modres.value)
            res.send({
              success: true,
              post: Post_to_ModifyPost_Res(modres.value)
            }).status(200)
          else
            res.sendStatus(404)
        })
    })

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }
)