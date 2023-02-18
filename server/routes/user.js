const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const bcrypt = require('bcryptjs')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")



router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id firstName lastName")
                .sort("-createdAt")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }

                    res.json({ user, posts })
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})

router.get('/allusers', requireLogin, (req, res) => {
    User.find()
        .select("-password")
        .then(users => {
            res.json({ users })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        })
            .select("-password")
            .then(result => {
                res.json({ result })
            })
            .catch(err => {

                return res.status(422).json({ error: err })
            })
    }
    )
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }

        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        })
            .select("-password")
            .then(result => {
                res.json({ result })
            })
            .catch(err => {

                return res.status(422).json({ error: err })
            })
    }
    )
})

router.put('/updatephoto', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { photo: req.body.photo } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            res.json(result)
        })
})

router.put('/updatedetails', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            res.json("Details succesfully changed!")
        })
})

router.put('/updatepassword', requireLogin, (req, res) => {
    password = req.body.password

    User.findById(req.user._id).select("password")
        .then(hashpass => {
            bcrypt.compare(password, hashpass.password)
                .then(doMatch => {
                    if (doMatch) {
                        bcrypt.hash(req.body.newpassword, 12)
                            .then(hashedPassword => {
                                User.findByIdAndUpdate(req.user._id, { $set: { password: hashedPassword } }, { new: true },
                                    (err, result) => {
                                        if (err) {
                                            return res.status(422).json({ error: err })
                                        }
                                        res.json({ res: "Password changed succesfully!" })
                                    })
                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        return res.status(422).json({ error: "Old password is not correct!" })
                    }
                })
                .catch(err => console.log(err))


        })
        .catch(err => console.log(err))

})

router.post('/searchuser', (req, res) => {
    regex = new RegExp("^" + req.body.query)
    User.find({ email: { $regex: regex } })
        .select("_id email")
        .then(user => {
            res.json({ user })
        })
        .catch(err => console.log(err))
})

router.delete('/deleteuser/:userid', requireLogin, (req, res) => {

    Post.deleteMany({ postedBy: req.params.userid }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "Error at delete" })
        }
    })
        .then(result => {

            User.deleteOne({ _id: req.params.userid }, (err, result) => {
                if (err) {
                    return res.status(422).json({ error: "Error at delete user" })
                }
            })
                .then(result => {
                    return res.json({ message: "User succesfully deleted!" })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

router.delete('/deleteposts/:userid', requireLogin, (req, res) => {

    Post.deleteMany({ postedBy: req.params.userid }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "Error at delete" })
        }
    })
        .then(result => {
            return res.json({ message: "Posts deleted succesfully" })
        })
        .catch(err => console.log(err))
})


module.exports = router