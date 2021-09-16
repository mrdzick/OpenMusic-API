const { Pool } = require('pg')
const InvariantError = require('../../exceptions/invariant-error')

class AuthenticationsService {
    constructor (cacheService) {
        this._pool = new Pool()
        this._cacheService = cacheService
    }

    async addRefreshToken (token) {
        try {
            await this._cacheService.get(`Token:${token}`)
        } catch (error) {
            const query = {
                text: 'INSERT INTO authentications VALUES($1)',
                values: [token]
            }
            const result = await this._pool.query(query)
            await this._cacheService.set(`Token:${token}`, JSON.stringify(result.rows))
        }
    }

    async verifyRefreshToken (token) {
        try {
            await this._cacheService.get(`Token:${token}`)
        } catch (error) {
            const query = {
                text: 'SELECT token FROM authentications WHERE token = $1',
                values: [token]
            }

            const result = await this._pool.query(query)

            if (!result.rowCount) {
                throw new InvariantError('Refresh token tidak valid')
            }

            await this._cacheService.set(`Token:${token}`, JSON.stringify(result.rows))
        }
    }

    async deleteRefreshToken (token) {
        await this.verifyRefreshToken(token)

        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token]
        }

        await this._pool.query(query)

        await this._cacheService.delete(`Token${token}`)
    }
}

module.exports = AuthenticationsService
