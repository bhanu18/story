const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Product = require('../models/Products')

router.get('/', ensureAuth, async function(req, res) {

    try {
        const products = await Product.find().lean()

        res.render('products/products', {
            products
        })

        console.log(products)
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

})

router.get('/add', ensureAuth, function(req, res) {
    res.render('products/add')
})

router.post('/', ensureAuth, async function(req, res) {
    try {
        await Product.create(req.body)
        console.log(req.body);
        res.redirect('/products')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router