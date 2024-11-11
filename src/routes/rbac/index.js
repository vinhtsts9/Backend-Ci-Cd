const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const rbacController = require('../../controllers/rbac.controller')

router.post('/resource', asyncHandler(rbacController.createResource))
router.post('/role', asyncHandler(rbacController.createRole))
router.get('/resources', asyncHandler(rbacController.getListResource))
router.get('/roles', asyncHandler(rbacController.getListRole))
module.exports = router