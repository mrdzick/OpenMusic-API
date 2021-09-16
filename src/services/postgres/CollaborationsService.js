const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')

class CollaborationsService {
    constructor (cacheService) {
        this._pool = new Pool()
        this._cacheService = cacheService
    }

    async addCollaboration (playlistId, userId) {
        const id = `collab-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal ditambahkan')
        }

        await this._cacheService.delete(`Collaboration:${playlistId}`)

        return result.rows[0].id
    }

    async deleteCollaboration (playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal dihapus')
        }

        await this._cacheService.delete(`SongsIn:${playlistId}`)
        await this._cacheService.delete(`Collaboration:${playlistId}`)
    }

    async verifyCollaborator (playlistId, userId) {
        try {
            const result = await this._cacheService.get(`Collaboration:${playlistId}`)
            return JSON.parse(result)
        } catch (error) {
            const query = {
                text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
                values: [playlistId, userId]
            }

            const result = await this._pool.query(query)

            if (!result.rowCount) {
                throw new InvariantError('Kolaborasi gagal diverifikasi')
            }

            await this._cacheService.set(`Collaboration:${playlistId}`, JSON.stringify(result.rows))
        }
    }
}

module.exports = CollaborationsService
