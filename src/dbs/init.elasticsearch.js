const { Client } = require('@elastic/elasticsearch')

let client = {}

const handleEventListener = async (instanceConnect) => {
    try {
        await instanceConnect.ping()
        console.log('Success connect to elasticsearch')
    } catch (error) {
        console.error(`err connect elasticsearch, ${error}`)
    }
}
const init = ({
    ELASTICSEARCH_IS_ENABLE,
    ELASTICSEARCH_HOST = 'http://localhost:9200'
}) => {
    if (ELASTICSEARCH_IS_ENABLE) {
        const instanceConnect = new Client({ node: ELASTICSEARCH_HOST })
        client.instanceConnect = instanceConnect

        handleEventListener(instanceConnect)
    }
}

const getClient = () => {
    return client
}

module.exports = { init, getClient }