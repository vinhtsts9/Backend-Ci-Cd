const Redis = require('ioredis');
const { BadRequestError } = require('../core/error.response');

let client = null;
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}

/*const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: 'Redis server error'
}

const handlerTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new BadRequestError({
            message: REDIS_CONNECT_MESSAGE,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })

    }, REDIS_CONNECT_TIMEOUT)
}*/

const handleEventConnection = (connectionRedis) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis-Connection status: connected')
        //clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis-Connection status: disconnected')
        //handlerTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis-Connection status: reconnecting')
        //clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis-Connection status: err ${err}`)
        //handlerTimeoutError()
    })
}

const init = async ({
    IOREDIS_IS_ENABLE,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST || 'host.docker.internal',
    IOREDIS_PORT = process.env.REDIS_CACHE_PORT || 6379
}) => {
    try {
        if (IOREDIS_IS_ENABLE) {
            const instanceRedis = new Redis({
                host: IOREDIS_HOST,
                port: IOREDIS_PORT
            });
            handleEventConnection(instanceRedis);
            client = instanceRedis;
        }

    }
    catch (error) {
        console.error('Lỗi khi kết nối Redis:', error);
        throw error; // Ném lỗi để xử lý ở cấp cao hơn
    }
};

const getRedisIo = () => {
    if (!client) {
        throw new Error('Redis chưa được khởi tạo. Hãy gọi hàm init() trước.');
    }
    return { instanceConnect: client };
};

const closeRedisIo = async () => {
    if (client) {
        await client.quit();
        console.log('Đã đóng kết nối Redis');
        client = null;
    }
};

module.exports = {
    init,
    getRedisIo,
    closeRedisIo
};