const resource = require('../models/resource.model')
const role = require('../models/role.model')

const createResource = async ({
    name = 'profile',
    slug = 'p001',
    description = ''
}) => {
    try {
        const newResource = await resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })
        return newResource
    } catch (error) {
        return error
    }


}
const getListResource = async ({
    userId = 0,
    limit =30,
    offset =0,
    search =''
}) => {
    try {
        const Resources = await resource.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])

        return Resources
    } catch (error) {
        return error
    }
}
const createRole = async ({
    name = 'shop',
    slug = 's0001',
    description = 'extend from shop',
    grants = []
}) => {
    try {
        const newRole = await role.create({
            rol_name: name,
            rol_slug: slug,
            rol_description: description,
            rol_grants: grants
        })
        return newRole
    } catch (error) {
        return error
    }
}

const getListRole = async ({
    userId = 0,
    limit =30,
    offset =0,
    search =''
}) => {
    try {
        const listRole = await role.aggregate([
            {
                $unwind: "$rol_grants"
            },
            {
                $lookup: {
                    from: "Resources",
                    localField:"rol_grants.resource",
                    foreignField: "_id",
                    as: "resource"
                }
            },
            {
                $unwind: "$resource"
            },
            {
                $project: {
                    role: "$rol_name",
                    resource: "$resource.src_name",
                    attributes: "$rol_grants.attributes",
                    action: "$rol_grants.actions"
                }
            },
            {
                $unwind: "$action"
            },
            {
                $project: {
                    _id:0,
                    role: 1,
                    resource:1,
                    attributes:1,
                    action: "$action"
                }
            }
        ])
        return listRole;
    } catch (error) {
        return error
    }

}
module.exports = {
    createResource, getListResource, createRole, getListRole
}