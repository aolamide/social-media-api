import Post from '../models/post.model';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';

const postById = (req, res, next, id) => {
    Post.findById(id)
    .populate('postedBy', '_id name')
    .exec((err, post) => {
        if(err|| post) {
            return res.status(400).json({
                error : err
            })
        }
        req.post = post;
        next()
    })
}
const getPosts = (req, res) => {
    Post.find()
    .populate('postedBy', "_id name")
    .select('_id title body')
    .then(posts => {
        res.json({ posts });
    })
    .catch(err => console.log(err))
};

const createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy  = req.profile;
        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error : err
                })
            }
            res.json(result)
        })
    })
};

postsByUser = (req, res) => {
    Post.find({postedBy : req.profile._id})
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
        if(err) return res.status(400).json({error : err})
        res.json(posts)
    })
}

isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if(!isPoster) {
        return res.status(403).json({
            error : 'User is not authorized'
        })
    }
    next();
}

updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updted = Date.now();
    post.save(err => {
        if(err) {
            return res.status(400).json({
                error : err
            })
        }
        res.json(post);
    })
}
deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if(err) {
            return res.status(400).json({error : err})
        }
        res.json({
            message : 'Post deleted successfully'
        })
    })
}


export { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost };