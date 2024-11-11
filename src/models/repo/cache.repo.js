const { getRedisIo } = require('../../dbs/init.ioredis')
const redisCache = getRedisIo().instanceConnect
const setCache = async ({ key, value }) => {
    if (!redisCache) {
        throw new Error('Redis client not installed')
    }
    try {
        return await redisCache.set(key, value)
    }
    catch (error) {
        throw new Error(`${error.message}`)
    }
}
const setCacheExpiration = async ({ key, value, expirationInSeconds }) => {
    if (!redisCache) {
        throw new Error('Redis client not installed')
    }
    try {
        return await redisCache.set(key, value, 'EX', expirationInSeconds)
    }
    catch (error) {
        throw new Error(`${error.message}`)
    }
}
const getCache = async ({ key }) => {
    if (!redisCache) {
        throw new Error('Redis client not installed')
    }
    try {
        return await redisCache.get(key)
    }
    catch (error) {
        throw new Error(`${error.message}`)
    }
}

module.exports = { setCache, setCacheExpiration, getCache }