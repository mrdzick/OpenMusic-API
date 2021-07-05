const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const NotFoundError = require('../../exceptions/not-found-error')

class SongsService {
    constructor () {
        this._songs = []
    }

    addSong ({ title, year, performer, genre, duration }) {
        const id = nanoid(16)
        const insertedAt = new Date().toISOString()
        const updatedAt = insertedAt

        const newSong = {
            title, year, performer, genre, duration, id, insertedAt, updatedAt
        }

        this._songs.push(newSong)

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0

        if (!isSuccess) {
            throw new InvariantError('Musik gagal ditambahkan')
        }

        return id
    }

    getAllSongs () {
        return this._songs
    }

    getSongById (id) {
        const song = this._songs.filter((song) => song.id === id)[0]

        if (!song) {
            throw new NotFoundError('Musik tidak ditemukan')
        }

        return song
    }

    editSongById (id, { title, year, performer, genre, duration }) {
        const index = this._songs.findIndex((song) => song.id === id)

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui musik. Id Musik tidak ditemukan')
        }

        const updatedAt = new Date().toISOString()

        this._songs[index] = {
            ...this._songs[index],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt
        }
    }

    deleteSongById (id) {
        const index = this._songs.findIndex((song) => song.id === id)

        if (index === -1) {
            throw new NotFoundError('Musik gagal dihapus. Id tidak ditemukan')
        }

        this._songs.splice(index, 1)
    }
}

module.exports = SongsService
