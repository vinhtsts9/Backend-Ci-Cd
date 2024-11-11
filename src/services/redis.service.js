const { promisify } = require('util')
const { reservationInventory } = require('../models/repo/inventory.repo')
const redis = require('ioredis')
const { getRedis } = require('../dbs/init.redis')
const { instanceConnect: redisClient } = getRedis()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promissify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setnxAsync(key, expireTime)
        if (result) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

    }
}
const releaseLock = async keyLock => {
    const delAsyncKey = promissify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}
module.exports = {
    acquireLock,
    releaseLock
}