import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Session, User, db } from 'astro:db'
import { Lucia } from 'lucia'

// Change the type of db in future versions of Astro
const adapter = new DrizzleSQLiteAdapter(db as any, Session, User)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: import.meta.env.PROD,
        },
    },

    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            username: attributes.username,
        }
    },
})

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}

interface DatabaseUserAttributes {
    username: string
}
