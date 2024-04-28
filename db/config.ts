import { column, defineDb, defineTable } from 'astro:db'

/**
 * Definición de la tabla de usarios.
 * @type {import('astro:db').TableDefinition}
 */
const User = defineTable({
    columns: {
        id: column.text({ primaryKey: true, optional: false, unique: true }),
        username: column.text({ optional: false, unique: true }),
        password: column.text({ optional: true }),
    },
})

/**
 * Definición de la tabla de sesiones.
 * @type {import('astro:db').TableDefinition}
 */
const Session = defineTable({
    columns: {
        id: column.text({ optional: false, unique: true }),
        userId: column.text({
            optional: false,
            references: () => User.columns.id,
        }),
        expiresAt: column.number({ optional: false }),
    },
})

/**
 * Definición de la base de datos.
 * @type {import('astro:db').DatabaseDefinition}
 */
// https://astro.build/db/config
export default defineDb({
    tables: {
        User,
        Session,
    },
})
