import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { getDb } from '@/lib/db'
import { users, workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const payload = await req.json()
  const headersList = await headers()
  const svixId = headersList.get('svix-id')
  const svixTimestamp = headersList.get('svix-timestamp')
  const svixSignature = headersList.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any
  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const db = getDb()

  switch (evt.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name, image_url, email_verified_at } = evt.data
      const primaryEmail = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id)?.email_address

      if (primaryEmail) {
        await db.insert(users).values({
          clerkId: id,
          email: primaryEmail,
          name: [first_name, last_name].filter(Boolean).join(' ') || null,
          imageUrl: image_url || null,
          emailVerified: email_verified_at ? new Date(email_verified_at) : null,
        }).onConflictDoNothing()

        const [user] = await db.select().from(users).where(eq(users.clerkId, id)).limit(1)
        if (user) {
          await db.insert(workspaces).values({
            userId: user.id,
            name: 'My Workspace',
          }).onConflictDoNothing()
        }
      }
      break
    }

    case 'user.updated': {
      const { id, email_addresses, first_name, last_name, image_url, email_verified_at } = evt.data
      const primaryEmail = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id)?.email_address

      if (primaryEmail) {
        await db.update(users)
          .set({
            email: primaryEmail,
            name: [first_name, last_name].filter(Boolean).join(' ') || null,
            imageUrl: image_url || null,
            emailVerified: email_verified_at ? new Date(email_verified_at) : null,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkId, id))
      }
      break
    }

    case 'user.deleted': {
      const { id } = evt.data
      await db.delete(users).where(eq(users.clerkId, id))
      break
    }
  }

  return new Response('OK', { status: 200 })
}