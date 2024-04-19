import type { APIContext } from 'astro'
import { User, db } from 'astro:db'
import { lucia } from 'auth'
import { generateId } from 'lucia'
import { Argon2id } from 'oslo/password'

export async function POST(context: APIContext): Promise<Response> {
    // parse the form data
    const formData = await context.request.formData()
    const username = formData.get('username')
    const password = formData.get('password')

    // validate the form data
    if (!username || !password) {
        return new Response(
            'Missing username or password, the data is needed',
            { status: 400 }
        )
    }
    if (typeof username !== 'string' || username.length < 4) {
        return new Response(
            'Username must be a string with at least 4 characters',
            { status: 400 }
        )
    }

    if (typeof password !== 'string' || password.length < 8) {
        return new Response(
            'Password must be a string with at least 8 characters',
            { status: 400 }
        )
    }
    // Insert the user into the database
    const userId = generateId(15)
    const hashedPassword = await new Argon2id().hash(password)

    await db.insert(User).values({
        id: userId,
        username,
        password: hashedPassword,
    })

    // Generate session
    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )
    return context.redirect('/')
}
