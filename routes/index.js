const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

router.get('/', ensureGuest, async(req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

router.get('/dashboard', ensureAuth, async(req, res) => {
    // console.log(req.user);

    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstname,
            stories
        })


    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})


module.exports = router