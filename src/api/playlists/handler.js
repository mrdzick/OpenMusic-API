class PlaylistsHandler {
    constructor (service, validator) {
        this._service = service
        this._validator = validator

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
        this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this)
        this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this)
        this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this)
    }

    async postPlaylistHandler ({ payload, auth }, h) {
        this._validator.validatePostPlaylistPayload(payload)
        const { name } = payload
        const { id: credentialId } = auth.credentials

        const playlistId = await this._service.addPlaylist({
            name, owner: credentialId
        })

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId
            }
        })
        response.code(201)
        return response
    }

    async getPlaylistsHandler ({ auth }) {
        const { id: credentialId } = auth.credentials
        const playlists = await this._service.getPlaylists(credentialId)
        return {
            status: 'success',
            data: {
                playlists
            }
        }
    }

    async deletePlaylistByIdHandler ({ params, auth }, h) {
        const { playlistId } = params
        const { id: credentialId } = auth.credentials

        await this._service.verifyPlaylistOwner(playlistId, credentialId)
        await this._service.deletePlaylistById(playlistId)

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus'
        }
    }

    async postSongToPlaylistHandler ({ payload, params, auth }, h) {
        this._validator.validatePostSongPayload(payload)
        const { playlistId } = params
        const { songId } = payload
        const { id: credentialId } = auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)

        await this._service.addSongToPlaylist(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist'
        })
        response.code(201)
        return response
    }

    async getSongsInPlaylistHandler ({ params, auth }, h) {
        const { playlistId } = params
        const { id: credentialId } = auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)

        const songs = await this._service.getSongsFromPlaylist(playlistId)
        return {
            status: 'success',
            data: {
                songs
            }
        }
    }

    async deleteSongFromPlaylistByIdHandler ({ params, payload, auth }, h) {
        const { playlistId } = params
        const { songId } = payload
        const { id: credentialId } = auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)
        await this._service.deleteSongFromPlaylist(playlistId, songId)

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist'
        }
    }

    async getUsersByUsernameHandler ({ query }, h) {
        const { username = '' } = query
        const users = await this._service.getUsersByUsername(username)
        return {
            status: 'success',
            data: {
                users
            }
        }
    }
}

module.exports = PlaylistsHandler
