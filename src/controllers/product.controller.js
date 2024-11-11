const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')
const { newSpu, oneSpu } = require('../services/spu.service')
const { oneSku } = require('../services/sku.service')

class ProductController {
    findOneSpu = async (req, res, next) => {
        try {
            const { product_id } = req.query;
            new SuccessResponse({
                message: 'get spu success',
                metadata: await oneSpu({ spu_id: product_id })
            }).send(res)
        } catch (error) {

        }
    }
    findOneSku = async (req, res, next) => {
        try {
            const { sku_id, product_id } = req.query;
            new SuccessResponse({
                message: 'get sku success',
                metadata: await oneSku({ sku_id, product_id })
            }).send(res)
        } catch (error) {

        }
    }
    createSpu = async (req, res, next) => {
        try {
            const spu = await newSpu({
                ...req.body,
                product_shop: req.user.userId
            })
            new SuccessResponse({
                message: "Success create spu",
                metadata: spu
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductService.createProduct(req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new publish success',
            metadata: await ProductService.publishProductByShop(
                {
                    product_id: req.params.id,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new unPublish success',
            metadata: await ProductService.unPublishProductByShop(
                {
                    productid: req.params.id,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Drafts success',
            metadata: await ProductService.findAllDraftsForShop(
                { product_shop: req.user.userId }
            )
        }).send(res)
    }
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductService.findAllPublishForShop(
                { product_shop: req.user.userId }
            )
        }).send(res)
    }
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search success',
            metadata: await ProductService.getListSearchProducts(req.params)
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update success',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res)
    }
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'find all product',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    findProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'find product',
            metadata: await ProductService.findProducts({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController()