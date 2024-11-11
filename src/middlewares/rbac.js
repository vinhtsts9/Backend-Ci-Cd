const rbac = require('./role.middleware')
const { AuthFailureError } = require('../core/error.response')
const { getListRole } = require('../services/rbac.service')
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await getListRole({
                userId: 1
            }))
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource)
            if (!permission.granted) throw new AuthFailureError('you dont have permission')
            next()
        } catch (error) {
            next(error) 
        }
        
    }
}
module.exports = {grantAccess}