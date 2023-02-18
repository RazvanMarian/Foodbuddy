const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')


router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, birthday } = req.body

    if (!email || !password || !firstName || !lastName || !birthday) {
        res.status(422).json({ error: "please add all the fields" })
        return
    }


    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists" })
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        birthday
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "e-mail or password invalid" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, firstName, lastName, email, following, followers, photo, kind } = savedUser
                        res.json({ token, user: { _id, firstName, lastName, email, following, followers, photo, kind } })
                    }
                    else {
                        return res.status(422).json({ error: "e-mail or password invalid" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router