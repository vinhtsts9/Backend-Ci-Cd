const { createResource, getListResource, createRole, getListRole } = require('../services/rbac.service')
const { SuccessResponse } = require('../core/success.response')

class RbacController {
    createResource = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful create resource',
            metadata: await createResource(req.body)
        }).send(res)
    }
    getListResource = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful get lists resource',
            metadata: await getListResource(req.query)
        }).send(res)
    }
    createRole = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful create role',
            metadata: await createRole(req.body)
        }).send(res)
    }
    getListRole = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful get list role',
            metadata: await getListRole(req.query)
        }).send(res)
    }
}
module.exports = new RbacController()