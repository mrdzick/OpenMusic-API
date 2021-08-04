/*eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            unique: true,
            references: 'playlists',
            referencesContstraintName: 'fk_collaborations_playlists',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            unique: true,
            references: 'users',
            referencesContstraintName: 'fk_collaborations_users',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }
    }, {
        ifNotExists: true
    })
}

exports.down = pgm => {
    pgm.dropTable('collaborations', {
        ifExists: true,
        cascade: true
    })
}
