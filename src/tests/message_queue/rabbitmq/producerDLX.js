const amqp = require('amqplib')

const message = 'new a product'

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx'
        const notiQueue = 'notificationQueueProcess'
        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
        //1: create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })
        //2: create Queue
        const queueResult = await channel.assertQueue( notiQueue, {
            exclusive: false, //cho phep cac ket noi truy cap vao cung 1 luc hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        //3: binding queue
        await channel.bindQueue(queueResult.queue, notificationExchange)
        //4:send message
        const msg = 'a new product'
        console.log(`producer msg `,msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        },500)
    } catch (error) {
        
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)