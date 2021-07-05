const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const NotFoundError = require('../../exceptions/not-found-error')

class SongsService {
    constructor () {
        this._pool = new Pool()
    }

    async addSong ({ title, year, performer, genre, duration }) {
        const id = nanoid(16)
        const insertedAt = new Date().toISOString()
        const updatedAt = insertedAt

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Musik gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getAllSongs () {
        const results = await this._pool.query('SELECT id, title, performer FROM songs')
        return results.rows
    }

    async getSongById (id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Musik tidak ditemukan')
        }

        return result.rows[0]
    }

    async editSongById (id, { title, year, performer, genre, duration }) {
        const updatedAt = new Date().toISOString()

        const query = {
            //penggunaan tanda petik pada updatedAt agar tidak di lowercase otomatis
            text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, "updatedAt"=$6 WHERE id=$7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Musik gagal dihapus. Id tidak ditemukan')
        }

        return result.rows[0].id
    }

    async deleteSongById (id) {
        const query = {
            text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Musik gagal dihapus. Id tidak ditemukan')
        }
    }
}

module.exports = SongsService
