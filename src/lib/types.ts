export interface Cover {
  kind: 'gradient' | 'color' | 'image'
  value: string
  offset: number
}

export interface Block {
  id: string
  type: BlockType
  text: string
  indent: number
  checked?: boolean
  collapsed?: boolean
  textColor?: string
  background?: string
  language?: string
  url?: string
  caption?: string
  icon?: string
  pageId?: string
  viewId?: string
  table?: string[][]
  headerRow?: boolean
  headerColumn?: boolean
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulleted'
  | 'numbered'
  | 'todo'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'code'
  | 'image'
  | 'bookmark'
  | 'embed'
  | 'file'
  | 'equation'
  | 'table'
  | 'pageLink'
  | 'childPage'
  | 'childDatabase'
  | 'tableOfContents'
  | 'breadcrumb'

export interface Page {
  id: string
  kind: 'page' | 'database' | 'row'
  title: string
  icon: string
  cover?: Cover
  parentId?: string
  order: number
  blocks: Block[]
  properties: Record<string, PropertyValue>
  schema?: DatabaseSchema
  views: DatabaseView[]
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
  comments: Comment[]
  dailyDate?: string
  isTemplate: boolean
  isInline: boolean
}

export interface Comment {
  id: string
  blockId: string
  parentId?: string
  author: string
  text: string
  createdAt: string
  resolved: boolean
}

export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'status'
  | 'date'
  | 'person'
  | 'files'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'createdTime'
  | 'lastEditedTime'
  | 'uniqueID'

export interface SelectOption {
  id: string
  name: string
  color: string
  group?: 'todo' | 'inProgress' | 'complete'
}

export interface RelationConfig {
  databaseId: string
  reversePropertyId?: string
}

export interface RollupConfig {
  relationPropertyId: string
  targetPropertyId: string
  function: RollupFunction
}

export type RollupFunction =
  | 'count'
  | 'countValues'
  | 'countUnique'
  | 'sum'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'range'
  | 'showOriginal'

export interface PropertyDefinition {
  id: string
  name: string
  type: PropertyType
  options?: SelectOption[]
  numberFormat?: string
  formula?: string
  relation?: RelationConfig
  rollup?: RollupConfig
  includeTime?: boolean
  idPrefix?: string
}

export interface DatabaseSchema {
  properties: PropertyDefinition[]
  nextUniqueNumber: number
}

export type DatabaseViewType = 'table' | 'board' | 'list' | 'gallery' | 'calendar' | 'timeline' | 'chart'

export interface FilterRule {
  id: string
  propertyId: string
  op: FilterOperator
  value: string
}

export type FilterOperator =
  | 'equals'
  | 'doesNotEqual'
  | 'contains'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'before'
  | 'after'
  | 'onOrBefore'
  | 'onOrAfter'

export type Conjunction = 'and' | 'or'

export interface SortRule {
  id: string
  propertyId: string
  ascending: boolean
}

export interface DateValue {
  start: string
  end?: string
  includeTime: boolean
}

export interface DatabaseView {
  id: string
  name: string
  type: DatabaseViewType
  filters: FilterRule[]
  conjunction: Conjunction
  sorts: SortRule[]
  groupBy?: string
  hiddenProperties: string[]
  propertyOrder: string[]
  dateProperty?: string
  endDateProperty?: string
  cardCover: 'pageCover' | 'property' | 'none'
  wrapCells: boolean
  chartKind: 'bar' | 'line' | 'area'
  hideEmptyGroups: boolean
  collapsedGroups: string[]
  columnWidths: Record<string, number>
}

export type PropertyValue =
  | { text: string }
  | { number: number }
  | { select: string }
  | { multiSelect: string[] }
  | { date: DateValue }
  | { checkbox: boolean }
  | { url: string }
  | { email: string }
  | { phone: string }
  | { relation: string[] }
  | { people: string[] }
  | { files: string[] }

export interface Workspace {
  id: string
  name: string
  pages: Record<string, Page>
}

export interface PageHistoryEntry {
  id: string
  pageId: string
  blocks: Block[]
  title: string
  icon: string
  createdAt: string
}

export interface Asset {
  id: string
  filename: string
  contentType: string
  size: number
  blobUrl: string
  createdAt: string
}

export interface AgentProfile {
  id: string
  name: string
  instructions: string
  model: string
  capabilities: string[]
  isBuiltIn: boolean
  createdAt: string
  updatedAt: string
}

export interface AgentChat {
  id: string
  agentId: string
  title: string
  messages: AgentMessage[]
  createdAt: string
  updatedAt: string
}

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  attachments?: string[]
  toolCalls?: ToolCall[]
  toolResult?: ToolResult
  createdAt: string
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export interface ToolResult {
  id: string
  name: string
  result: unknown
  error?: string
}

export interface AgentFile {
  id: string
  path: string
  name: string
  content?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  appearance: number
  commentAuthor: string
  recentSearches: string[]
  expandedPages: string[]
  graphViewSettings: GraphViewSettings
  graphSheetFilters: boolean
  graphSheetGroups: boolean
  graphSheetDisplay: boolean
  graphSheetForces: boolean
  notesStyle: string
  notesOnComputer: boolean
  notesCheckWeb: boolean
  notesCleanTranscripts: boolean
  aiProvider: string
  aiRouting: string
  aiLocalModel: string
  aiBridgeUrl: string
  aiBridgeName: string
  aiApiModel: string
  aiBridgeModel: string
  aiCodexModel: string
  aiApiProvider: string
  aiApiProviderModel: string
  aiEffort: string
  aiAgentWeb: boolean
  aiAgentShell: boolean
  aiAgentHarness: boolean
}

export interface GraphViewSettings {
  layout: string
  nodeSize: number
  edgeWidth: number
  showLabels: boolean
  physics: boolean
}

export interface APIProviderInfo {
  id: string
  name: string
  baseURL: string
  placeholders?: Record<string, string>
  keyURL?: string
  keyOptional?: boolean
  isFree?: boolean
  terms?: string
  verified?: boolean
  listsModels?: boolean
  freeSuffix?: string
  transcriptionModel?: string
  models: APIModelInfo[]
  extraHeaders?: Record<string, string>
  custom?: boolean
}

export interface APIModelInfo {
  id: string
  contextTokens?: number
  tools?: boolean
  vision?: boolean
  note?: string
}