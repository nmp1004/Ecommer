const express = require('express')
const { createProduct, getaProduct, getAllProduct,updateProduct, deleteProduct } = require('../controller/productCtrl')
const router = express.Router()

router.post("/", createProduct)
router.get("/:id",getaProduct)
router.get("/",getAllProduct)
router.put("/:id",updateProduct)

module.exports = router