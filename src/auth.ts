import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Session, User, db } from 'astro:db'
import { Lucia } from 'lucia'

// Change the type of db in future versions of Astro
/**
 * Adaptador SQLite para el sistema de autenticación Lucía.
 * @type {DrizzleSQLiteAdapter}
 */
const adapter = new DrizzleSQLiteAdapter(db as any, Session, User)

/**
 * Intancia principal de la aplicación Lucía.
 * @type {Lucia}
 */
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: import.meta.env.PROD,
    },
  },

  /**
   * Función para obtener los atributos del usuario.
   * @param {DatabaseUserAttributes} attributes - Atributos del usuario en la base de datos.
   * @returns {object} - Atributos del usario para la sesión.
   */
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    }
  },
})

/**
 * Extensión de módulo para añadir tipos personalizados a Lucía.
 * @module lucia
 */
declare module 'lucia' {
  interface Register {
    /**
     * Clase principal de la aplicación Lucía.
     * @type {typeof lucia}
     */
    Lucia: typeof lucia
    /**
     * Interfaz para los atributos de usario en la base de datos
     * @type {DatabaseUserAttributes}
     */
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

/**
 * Interfaz para los atributos de usuario en la base de datos
 * @interface DatabaseUserAttributes
 */
interface DatabaseUserAttributes {
  /**
   * Nombre de usuario del usuario en la base de datos
   * @type {string}
   */
  username: string
}
