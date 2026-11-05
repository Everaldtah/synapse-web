import 'dotenv/config'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { unzip } from 'fflate'

// Helper to execute raw queries using sql.query()
async function query(sqlClient: any, query: string, params: any[] = []) {
  return sqlClient.query(query, params)
}

interface SynapsePage {
  id: string
  kind: 'page' | 'database' | 'row'
  title: string
  icon: string
  cover?: { kind: string; value: string; offset: number }
  parentID?: string
  order: number
  blocks: any[]
  properties: Record<string, any>
  schema?: any
  views: any[]
  createdAt: string
  updatedAt: string
  lastOpenedAt?: string
  isFavorite: boolean
  trashedAt?: string
  fullWidth: boolean
  smallText: boolean
  font: 'standard' | 'serif' | 'mono'
  locked: boolean
  aliases: string[]
  comments: any[]
  dailyDate?: string
  isTemplate: boolean
  isInline: boolean
}

interface SynapseHistoryEntry {
  id: string
  blocks: any[]
  title: string
  icon: string
  kind: string
  properties: Record<string, any>
  views: any[]
  createdAt: string
  updatedAt: string
  order: number
  aliases: string[]
  comments: any[]
  font: string
  fullWidth: boolean
  locked: boolean
  smallText: boolean
  isTemplate: boolean
  isInline: boolean
  isFavorite: boolean
  lastOpenedAt?: string
}

interface SynapseAgentChat {
  id: string
  messages: any[]
  agentID: string
  updatedAt: string
  title: string
  model: string
  createdAt: string
}

async function main() {
  const importPath = process.argv[2]
  const userEmail = process.argv[3]

  if (!importPath || !userEmail) {
    console.error('Usage: tsx scripts/import-workspace.ts <path-to-synapse-zip> <user-email>')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  console.log(`Importing workspace from ${importPath} for user ${userEmail}...`)

  // Find user
  const userResult = await query(sql, 'SELECT * FROM users WHERE email = $1 LIMIT 1', [userEmail])
  if (!userResult || userResult.length === 0) {
    console.error('User not found')
    process.exit(1)
  }
  const user = userResult[0]

  // Get or create workspace
  let workspaceResult = await query(sql, 'SELECT * FROM workspaces WHERE user_id = $1 LIMIT 1', [user.id])
  let workspace
  if (!workspaceResult || workspaceResult.length === 0) {
    workspaceResult = await query(sql, 'INSERT INTO workspaces (user_id, name) VALUES ($1, $2) RETURNING *', [user.id, 'My Workspace'])
  }
  workspace = workspaceResult[0]

  // Read and parse ZIP
  const zipBuffer = fs.readFileSync(importPath)
  const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(new Uint8Array(zipBuffer), (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  console.log(`Found ${Object.keys(files).length} files in archive`)

  // Parse all pages
  const parsedPages: SynapsePage[] = []
  const pageIdMap = new Map<string, string>()

  for (const [filePath, fileData] of Object.entries(files)) {
    if (filePath.match(/Synapse\/Synapse\/pages\/[^/]+\.json$/)) {
      const pageData: SynapsePage = JSON.parse(new TextDecoder().decode(fileData))
      parsedPages.push(pageData)
    }
  }

  console.log(`Found ${parsedPages.length} pages`)

  // Import pages (two passes: first create all, then update parent refs)
  for (const page of parsedPages) {
    const newId = uuidv4()
    pageIdMap.set(page.id, newId)

    await query(sql, `
      INSERT INTO pages (id, workspace_id, kind, title, icon, cover_kind, cover_value, cover_offset, parent_id, "order", blocks, properties, schema, views, created_at, updated_at, last_opened_at, is_favorite, trashed_at, full_width, small_text, font, locked, aliases, comments, daily_date, is_template, is_inline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
    `, [
      newId,
      workspace.id,
      page.kind,
      page.title,
      page.icon,
      page.cover?.kind || null,
      page.cover?.value || null,
      page.cover?.offset?.toString() || null,
      null, // parent_id - will update in second pass
      page.order.toString(),
      JSON.stringify(page.blocks),
      JSON.stringify(page.properties),
      JSON.stringify(page.schema),
      JSON.stringify(page.views),
      page.createdAt,
      page.updatedAt,
      page.lastOpenedAt || null,
      page.isFavorite,
      page.trashedAt || null,
      page.fullWidth,
      page.smallText,
      page.font,
      page.locked,
      JSON.stringify(page.aliases),
      JSON.stringify(page.comments),
      page.dailyDate || null,
      page.isTemplate,
      page.isInline,
    ])
  }

  // Second pass: update parentId references using raw query
  for (const page of parsedPages) {
    if (page.parentID && pageIdMap.has(page.parentID)) {
      const newId = pageIdMap.get(page.id)!
      const parentId = pageIdMap.get(page.parentID)!
      await query(sql, 'UPDATE pages SET parent_id = $1 WHERE id = $2', [parentId, newId])
    }
  }

  console.log(`Imported ${parsedPages.length} pages`)

  // Import history
  const historyByPage = new Map<string, SynapseHistoryEntry[]>()

  for (const [filePath, fileData] of Object.entries(files)) {
    const match = filePath.match(/Synapse\/Synapse\/history\/([^/]+)\/([^/]+)\.json$/)
    if (match) {
      const pageId = match[1]
      const historyData: SynapseHistoryEntry = JSON.parse(new TextDecoder().decode(fileData))
      if (!historyByPage.has(pageId)) {
        historyByPage.set(pageId, [])
      }
      historyByPage.get(pageId)!.push(historyData)
    }
  }

  for (const [originalPageId, historyEntries] of historyByPage) {
    const newPageId = pageIdMap.get(originalPageId)
    if (!newPageId) continue

    for (const entry of historyEntries) {
      await query(sql, `
        INSERT INTO page_history (id, page_id, blocks, title, icon, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        uuidv4(),
        newPageId,
        JSON.stringify(entry.blocks),
        entry.title,
        entry.icon,
        entry.createdAt,
      ])
    }
    console.log(`Imported ${historyEntries.length} history entries for page ${originalPageId}`)
  }

  // Import agent chats
  const agentChatsByAgent = new Map<string, SynapseAgentChat[]>()

  for (const [filePath, fileData] of Object.entries(files)) {
    const match = filePath.match(/Synapse\/Synapse\/agents\/chats\/([^/]+)\.json$/)
    if (match) {
      const chatData: SynapseAgentChat = JSON.parse(new TextDecoder().decode(fileData))
      if (!agentChatsByAgent.has(chatData.agentID)) {
        agentChatsByAgent.set(chatData.agentID, [])
      }
      agentChatsByAgent.get(chatData.agentID)!.push(chatData)
    }
  }

  // Create agent profiles first (if they don't exist, create placeholder)
  for (const [agentId, chats] of agentChatsByAgent) {
    const existingProfile = await query(sql, 'SELECT * FROM agent_profiles WHERE id = $1 LIMIT 1', [agentId])
    if (!existingProfile || existingProfile.length === 0) {
      // We'll use the first chat's model info
      const firstChat = chats[0]
      await query(sql, `
        INSERT INTO agent_profiles (id, workspace_id, name, instructions, model, capabilities, is_built_in)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        agentId,
        workspace.id,
        `Imported Agent ${agentId.slice(0, 8)}`,
        'Imported from iOS Synapse',
        firstChat.model,
        JSON.stringify([]),
        false,
      ])
    }
  }

  for (const [agentId, chats] of agentChatsByAgent) {
    for (const chat of chats) {
      await query(sql, `
        INSERT INTO agent_chats (id, workspace_id, agent_id, title, messages, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        chat.id,
        workspace.id,
        agentId,
        chat.title,
        JSON.stringify(chat.messages),
        chat.createdAt,
        chat.updatedAt,
      ])
    }
    console.log(`Imported ${chats.length} chats for agent ${agentId}`)
  }

  // Import agent files
  for (const [filePath, fileData] of Object.entries(files)) {
    const match = filePath.match(/Synapse\/Synapse\/Agent Files\/(.+)$/)
    if (match) {
      const relativePath = match[1]
      const filename = path.basename(relativePath)
      const content = new TextDecoder().decode(fileData)

      await query(sql, `
        INSERT INTO agent_files (id, workspace_id, path, name, content)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        uuidv4(),
        workspace.id,
        relativePath,
        filename,
        content.length < 10000 ? content : content.slice(0, 10000) + '... [truncated]',
      ])
    }
  }

  console.log('Imported agent files')

  // Import assets (just metadata for now, actual upload to Vercel Blob later)
  for (const [filePath, fileData] of Object.entries(files)) {
    const match = filePath.match(/Synapse\/Synapse\/assets\/([^/]+)$/)
    if (match) {
      const filename = match[1]
      console.log(`Asset: ${filename} (${fileData.length} bytes)`)
      // TODO: Upload to Vercel Blob and save blobUrl
    }
  }

  // Update workspace name
  await query(sql, 'UPDATE workspaces SET name = $1 WHERE id = $2', ['My Workspace', workspace.id])

  console.log('Import complete!')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})