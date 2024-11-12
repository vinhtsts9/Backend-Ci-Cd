const dev = {
    app: {
        port: process.env.DEVAPPPORT || 3052,
    },
    db: {
        host: process.env.DEVDBHOST || '0.0.0.0',
        port: process.env.DEVDBPORT || 27017,
        name: process.env.DEVDBNAME || 'shopDEV'
    }
}
const pro = {
    app: {
        port: process.env.PROAPPPORT || 3000,
    },
    db: {
        host: process.env.PRODBHOST || '0.0.0.0',
        port: process.env.PRODBPORT || 27017,
        name: process.env.PRODBNAME || 'shopPRO'
    }
}
const config = { dev, pro }
const env = process.env.NODEENV || 'dev'
module.exports = config[env]