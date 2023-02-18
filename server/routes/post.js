const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')


// router.get('/allpost', requireLogin, (req, res) => {
//     Post.find()
//         .populate("postedBy", "_id firstName lastName photo")
//         .populate("comments.postedBy", "_id firstName lastName")
//         .sort("-createdAt")
//         .then(posts => {
//             res.json({ posts })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

router.get('/followposts', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id firstName lastName photo")
        .populate("comments.postedBy", "_id firstName lastName")
        .sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/category/:cat', (req, res) => {
    console.log(req.params)
    Post.find({ categories: req.params.cat })
        .populate("postedBy", "_id firstName lastName photo")
        .populate("comments.postedBy", "_id firstName lastName")
        .sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, description, recipe, picUrl, categories } = req.body
    if (!title || !picUrl || !recipe) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        description,
        recipe,
        photo: picUrl,
        categories,
        postedBy: req.user
    })
    post.save()
        .then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id firstName lastName")
        .sort("-createdAt")
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id firstName lastName")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

module.exports = router