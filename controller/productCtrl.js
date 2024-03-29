const Product = require('../models/productModel')
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

// Create A Product

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})


// Update A Product 

const updateProduct = asyncHandler( async (req,res) => { 
    const id = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({id},req.body, {
            new: true,
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
 }) 

// Get A Product

const getaProduct = asyncHandler( async (req,res) => { 
    const {id} = req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
 })

// Get All Product

const getAllProduct = asyncHandler(async (req,res) => { 
    try {
        const getAllProducts = await Product.find();
        res.json(getAllProducts)
    } catch (error) {
        throw new Error(error)
    }
 })
module.exports = { createProduct, getaProduct, getAllProduct, updateProduct}