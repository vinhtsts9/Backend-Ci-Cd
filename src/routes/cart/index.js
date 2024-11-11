const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const CartController = require('../../controllers/cart.controller')

router.post('', asyncHandler(CartController.addTocart))
router.delete('', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.listToCart))

module.exports = router