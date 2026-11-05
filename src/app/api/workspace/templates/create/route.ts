import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'

const TEMPLATES = {
  meeting: {
    title: 'Meeting Notes',
    icon: '📝',
    blocks: [
      { type: 'heading', content: 'Meeting Notes', level: 1 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Attendees', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Agenda', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Action Items', level: 2 },
      { type: 'todo_list', content: '' },
    ],
  },
  project: {
    title: 'Project Plan',
    icon: '📋',
    blocks: [
      { type: 'heading', content: 'Project Plan', level: 1 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Overview', level: 2 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Goals', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Timeline', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Tasks', level: 2 },
      { type: 'todo_list', content: '' },
    ],
  },
  daily: {
    title: 'Daily Notes',
    icon: '📅',
    blocks: [
      { type: 'heading', content: "Today's Notes", level: 1 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Tasks', level: 2 },
      { type: 'todo_list', content: '' },
      { type: 'heading', content: 'Notes', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Reflection', level: 2 },
      { type: 'paragraph', content: '' },
    ],
  },
  research: {
    title: 'Research Document',
    icon: '🔍',
    blocks: [
      { type: 'heading', content: 'Research Document', level: 1 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Question', level: 2 },
      { type: 'paragraph', content: '' },
      { type: 'heading', content: 'Sources', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Findings', level: 2 },
      { type: 'bulleted_list', content: '' },
      { type: 'heading', content: 'Conclusion', level: 2 },
      { type: 'paragraph', content: '' },
    ],
  },
}

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getWorkspaceForClerkUser(userId)

  if (!result?.workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
  }
  const workspace = result.workspace

  const formData = await req.formData()
  const templateId = formData.get('templateId') as string

  const template = TEMPLATES[templateId as keyof typeof TEMPLATES]
  if (!template) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
  }

  const db = getDb()
  const [page] = await db.insert(pages).values({
    workspaceId: workspace.id,
    kind: 'page',
    title: template.title,
    icon: template.icon,
    blocks: template.blocks,
    isTemplate: false,
  }).returning()

  return NextResponse.redirect(new URL(`/workspace/pages/${page.id}`, req.url))
}