const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,1]))
}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,0]))
}
const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(k => {
        const placeHolder = `{{${k}}}`
        template = template.replace(new RegExp(placeHolder, 'g'), params[k])
    })
    return template
}
const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if(obj[k] === undefined) {
            delete obj[k]
        }
    })
    return obj
}
const randomProductId = _ => {
    return Math.floor(Math.random() * 899999 + 100000)
}
module.exports = { getInfoData, replacePlaceholder, randomProductId, getUnSelectData, getSelectData, removeUndefinedObject }