require('dotenv').config()
const amqp = require('amqplib')
const SongsService = require('./songs-service')
const MailSender = require('./mail-sender')
const Listener = require('./listener')

const init = async () => {
    const songsService = new SongsService()
    const mailSender = new MailSender()
    const listener = new Listener(songsService, mailSender)

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()

    await channel.assertQueue('export: songs', {
        durable: true
    })

    await channel.consume('export: songs', listener.listen, { noAck: true })
}

init()
