const Hapi = require('@hapi/hapi')
const songs = require('./api/songs')
const SongsService = require('./services/postgres/songs-service')
const SongsValidator = require('./validator/songs')
require('dotenv').config()

const init = async () => {
    const songsService = new SongsService()

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register({
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator
        }
    })
    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
