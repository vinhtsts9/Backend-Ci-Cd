const temModel = require('../models/template.model')
const { emailTemplateHtml } = require('../utils/tem.html')
const newTemplate = async ({ tem_name }) => {
    const newTemplate = await temModel.create({
        tem_id: 1,
        tem_name,
        tem_html: emailTemplateHtml()
    })

    return newTemplate
}

const getTemplate = async ({ tem_name }) => {
    const template = await temModel.findOne({ tem_name })
    return template
}

module.exports = { newTemplate, getTemplate }