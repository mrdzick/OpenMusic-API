/*eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('playlistsongs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            referencesContstraintName: 'fk_playlistsongs_playlists',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        song_id: {
            type: 'VARCHAR(25)',
            notNull: true,
            references: 'songs',
            referencesContstraintName: 'fk_playlistsongs_songs',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }
    }, {
        ifNotExists: true
    })
}

exports.down = pgm => {
    pgm.dropTable('playlistsongs', {
        ifExists: true,
        cascade: true
    })
}
