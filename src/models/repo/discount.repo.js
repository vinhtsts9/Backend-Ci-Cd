const { getSelectData, getUnSelectData } = require("../../utils")
const { discount } = require('../discount.model')
const findAllDiscountCodeSelected = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discountCodes = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return discountCodes
}
const findAllDiscountCodeUnSelected = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discountCodes = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    return discountCodes
}

const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}
module.exports = {
    findAllDiscountCodeSelected,
    checkDiscountExists,
    findAllDiscountCodeUnSelected
}