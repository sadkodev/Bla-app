import type { APIContext } from 'astro'
import { User, db, eq } from 'astro:db'
import { lucia } from 'auth'
import { Argon2id } from 'oslo/password'

export async function POST(context: APIContext): Promise<Response> {
    // read the form data
    const formData = await context.request.formData()
    const username = formData.get('username')
    const password = formData.get('password')

    if (typeof username !== 'string') {
        return new Response('Invalid username', { status: 400 })
    }

    if (typeof password !== 'string') {
        return new Response('Invalid password', { status: 400 })
    }

    // Search the user
    const foundUser = (
        await db.select().from(User).where(eq(User.username, username))
    ).at(0)

    // if user not found
    if (!foundUser) {
        return new Response('Incorrect username or password', { status: 400 })
    }

    // Verify the password
    if (!foundUser.password) {
        return new Response('Invalid password', { status: 400 })
    }

    const validPassword = await new Argon2id().verify(
        foundUser.password,
        password
    )

    // If password is invalid
    if (!validPassword) {
        return new Response('Incorrect username or password', { status: 400 })
    }

    // Password is valid, user can be logged in
    const session = await lucia.createSession(foundUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )

    return context.redirect('/')
}
