import { pgTable, uuid, text, timestamp, boolean, jsonb, index, uniqueIndex, type AnyPgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  imageUrl: text('image_url'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_clerk_id_idx').on(table.clerkId),
  uniqueIndex('users_email_idx').on(table.email),
])

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('My Workspace'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('workspaces_user_id_idx').on(table.userId),
])

// Self-referential table: declare with type first, then assign
let pages: AnyPgTable
pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  kind: text('kind', { enum: ['page', 'database', 'row'] }).notNull().default('page'),
  title: text('title').notNull().default(''),
  icon: text('icon').notNull().default(''),
  coverKind: text('cover_kind'),
  coverValue: text('cover_value'),
  coverOffset: text('cover_offset'),
  parentId: uuid('parent_id').references(() => (pages as any).id, { onDelete: 'set null' }),
  order: text('order').notNull().default('0'),
  blocks: jsonb('blocks').notNull().default([]),
  properties: jsonb('properties').notNull().default({}),
  schema: jsonb('schema'),
  views: jsonb('views').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastOpenedAt: timestamp('last_opened_at', { withTimezone: true }),
  isFavorite: boolean('is_favorite').notNull().default(false),
  trashedAt: timestamp('trashed_at', { withTimezone: true }),
  fullWidth: boolean('full_width').notNull().default(false),
  smallText: boolean('small_text').notNull().default(false),
  font: text('font', { enum: ['standard', 'serif', 'mono'] }).notNull().default('standard'),
  locked: boolean('locked').notNull().default(false),
  aliases: jsonb('aliases').notNull().default([]),
  comments: jsonb('comments').notNull().default([]),
  dailyDate: text('daily_date'),
  isTemplate: boolean('is_template').notNull().default(false),
  isInline: boolean('is_inline').notNull().default(false),
}, (table) => [
  index('pages_workspace_id_idx').on(table.workspaceId),
  index('pages_parent_id_idx').on(table.parentId),
  index('pages_trashed_at_idx').on(table.trashedAt),
  index('pages_is_favorite_idx').on(table.isFavorite),
  index('pages_kind_idx').on(table.kind),
])
export { pages }

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  size: text('size').notNull(),
  blobUrl: text('blob_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('assets_workspace_id_idx').on(table.workspaceId),
])

export const pageHistory = pgTable('page_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => (pages as any).id, { onDelete: 'cascade' }),
  blocks: jsonb('blocks').notNull(),
  title: text('title').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('page_history_page_id_idx').on(table.pageId),
])

export const agentProfiles = pgTable('agent_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  instructions: text('instructions').notNull(),
  model: text('model').notNull(),
  capabilities: jsonb('capabilities').notNull().default([]),
  isBuiltIn: boolean('is_built_in').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('agent_profiles_workspace_id_idx').on(table.workspaceId),
])

export const agentChats = pgTable('agent_chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').notNull().references(() => agentProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  messages: jsonb('messages').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('agent_chats_workspace_id_idx').on(table.workspaceId),
  index('agent_chats_agent_id_idx').on(table.agentId),
])

export const agentFiles = pgTable('agent_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  name: text('name').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('agent_files_workspace_id_idx').on(table.workspaceId),
])

export const preferences = pgTable('preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('preferences_user_key_idx').on(table.userId, table.key),
])