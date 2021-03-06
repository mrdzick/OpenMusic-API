class SongsHandler {
    constructor (service, validator) {
        this._service = service
        this._validator = validator

        this.postSongHandler = this.postSongHandler.bind(this)
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    async postSongHandler (request, h) {
        this._validator.validateSongPayload(request.payload)
        const { title, year, performer, genre, duration } = request.payload

        const songId = await this._service.addSong({ title, year, performer, genre, duration })

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId
            }
        })
        response.code(201)
        return response
    }

    async getAllSongsHandler () {
        const songs = await this._service.getAllSongs()

        return {
            status: 'success',
            data: {
                songs
            }
        }
    }

    async getSongByIdHandler (request, h) {
        const { id } = request.params
        const song = await this._service.getSongById(id)

        const response = h.response({
            status: 'success',
            data: {
                song
            }
        })
        response.code(200)
        return response
    }

    async putSongByIdHandler (request, h) {
        this._validator.validateSongPayload(request.payload)
        const { id } = request.params

        await this._service.editSongById(id, request.payload)

        return {
            status: 'success',
            message: 'lagu berhasil diperbarui'
        }
    }

    async deleteSongByIdHandler (request, h) {
        const { id } = request.params
        await this._service.deleteSongById(id)

        const response = h.response({
            status: 'success',
            message: 'lagu berhasil dihapus'
        })
        response.code(200)
        return response
    }
}

module.exports = SongsHandler
