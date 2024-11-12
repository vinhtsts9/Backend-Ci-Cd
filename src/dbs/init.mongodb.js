const mongoose = require("mongoose");
const { db: { host, name, port } } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
console.log(`host:::${host  },port:::${port  },name:::${name  }`)
class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString).then(a => { console.log(`connected mongodb`) }).catch(err => console.log(`Err connect`))
    }
    static getIntance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getIntance()
module.exports = instanceMongodb