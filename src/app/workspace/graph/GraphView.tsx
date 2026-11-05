'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, Settings, Search, Minimize2, Maximize2, RefreshCw } from 'lucide-react'

export interface PageNode {
  id: string
  title: string
  content: string
  parentId: string | null
  workspaceId: string
  createdAt: Date
  updatedAt: Date
}

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  page: PageNode
}

interface GraphLink {
  source: string
  target: string
  distance: number
}

interface GraphSettings {
  nodeSize: number
  linkDistance: number
  repulsion: number
  centerGravity: number
  showLabels: boolean
  showClusters: boolean
  physicsEnabled: boolean
  layout: 'force' | 'circular' | 'radial'
}

const FOLDER_COLORS = [
  '#6E56CF',
  '#E2A7F0',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#F97316',
  '#EC4899',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getFolderColor(title: string): string {
  const folder = title.split('/')[0] || 'root'
  return FOLDER_COLORS[hashString(folder) % FOLDER_COLORS.length]
}

function buildGraphData(pages: PageNode[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodeMap = new Map<string, GraphNode>()
  const links: GraphLink[] = []

  pages.forEach((page, index) => {
    const angle = (index / pages.length) * Math.PI * 2
    const radius = 150
    nodeMap.set(page.id, {
      id: page.id,
      label: page.title.split('/').pop() || page.title,
      x: Math.cos(angle) * radius + 400,
      y: Math.sin(angle) * radius + 300,
      vx: 0,
      vy: 0,
      size: 8,
      color: getFolderColor(page.title),
      page,
    })
  })

  pages.forEach((page) => {
    if (page.parentId && nodeMap.has(page.parentId)) {
      links.push({
        source: page.parentId,
        target: page.id,
        distance: 100,
      })
    }
  })

  return { nodes: Array.from(nodeMap.values()), links }
}

export default function GraphView({ pages: pagesData, workspaceId }: { pages: PageNode[]; workspaceId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [links, setLinks] = useState<GraphLink[]>([])
  const [settings, setSettings] = useState<GraphSettings>({
    nodeSize: 8,
    linkDistance: 100,
    repulsion: 400,
    centerGravity: 0.1,
    showLabels: true,
    showClusters: true,
    physicsEnabled: true,
    layout: 'force',
  })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<GraphNode[]>([])

  useEffect(() => {
    const { nodes: initialNodes, links: initialLinks } = buildGraphData(pagesData)
    setNodes(initialNodes)
    setLinks(initialLinks)
  }, [pagesData])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth * window.devicePixelRatio
        canvas.height = container.clientHeight * window.devicePixelRatio
        canvas.style.width = container.clientWidth + 'px'
        canvas.style.height = container.clientHeight + 'px'
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      ctx.save()
      ctx.translate(pan.x, pan.y)
      ctx.scale(zoom, zoom)

      if (settings.physicsEnabled) {
        for (let i = 0; i < nodes.length; i++) {
          const nodeA = nodes[i]
          for (let j = i + 1; j < nodes.length; j++) {
            const nodeB = nodes[j]
            const dx = nodeB.x - nodeA.x
            const dy = nodeB.y - nodeA.y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = settings.repulsion / (dist * dist)
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            nodeA.vx -= fx * dt
            nodeA.vy -= fy * dt
            nodeB.vx += fx * dt
            nodeB.vy += fy * dt
          }
        }

        links.forEach((link) => {
          const source = nodes.find(n => n.id === link.source)
          const target = nodes.find(n => n.id === link.target)
          if (!source || !target) return

          const dx = target.x - source.x
          const dy = target.y - source.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (dist - settings.linkDistance) / dist * 0.5
          const fx = dx * force
          const fy = dy * force
          source.vx += fx * dt
          source.vy += fy * dt
          target.vx -= fx * dt
          target.vy -= fy * dt
        })

        const centerX = width / 2 / zoom - pan.x / zoom
        const centerY = height / 2 / zoom - pan.y / zoom
        nodes.forEach((node) => {
          const dx = centerX - node.x
          const dy = centerY - node.y
          node.vx += dx * settings.centerGravity * dt
          node.vy += dy * settings.centerGravity * dt
        })

        nodes.forEach((node) => {
          node.x += node.vx * dt
          node.y += node.vy * dt
          node.vx *= 0.9
          node.vy *= 0.9
        })

        setNodes([...nodes])
      }

      ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)'
      ctx.lineWidth = 1
      links.forEach((link) => {
        const source = nodes.find(n => n.id === link.source)
        const target = nodes.find(n => n.id === link.target)
        if (!source || !target) return

        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      })

      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id
        const isSelected = selectedNode?.id === node.id
        const nodeSize = settings.nodeSize * (isHovered || isSelected ? 1.5 : 1)

        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)

        if (isSelected) {
          ctx.fillStyle = '#6E56CF'
          ctx.shadowColor = '#6E56CF'
          ctx.shadowBlur = 15
        } else if (isHovered) {
          ctx.fillStyle = node.color
          ctx.shadowColor = node.color
          ctx.shadowBlur = 10
        } else {
          ctx.fillStyle = settings.showClusters ? node.color : '#6E56CF'
        }

        ctx.fill()
        ctx.shadowBlur = 0

        ctx.strokeStyle = isSelected ? '#6E56CF' : 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = isSelected ? 3 : 1.5
        ctx.stroke()

        if (settings.showLabels && (zoom > 0.5 || isHovered || isSelected)) {
          ctx.fillStyle = '#111827'
          ctx.font = `${Math.max(10, 12 / zoom)}px system-ui, sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(node.label, node.x, node.y + nodeSize + 14 / zoom)
        }
      })

      ctx.restore()

      const nodeCountEl = document.getElementById('node-count')
      const edgeCountEl = document.getElementById('edge-count')
      const zoomLevelEl = document.getElementById('zoom-level')
      if (nodeCountEl) nodeCountEl.textContent = `${nodes.length} nodes`
      if (edgeCountEl) edgeCountEl.textContent = `${links.length} edges`
      if (zoomLevelEl) zoomLevelEl.textContent = `${Math.round(zoom * 100)}%`

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current!)
      window.removeEventListener('resize', resize)
    }
  }, [nodes, links, settings, zoom, pan])

  const getCanvasPoint = (e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      canvasRef.current?.style.setProperty('cursor', 'grabbing')
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
      return
    }

    const point = getCanvasPoint(e)
    let found = false

    for (const node of nodes) {
      const dx = node.x - point.x
      const dy = node.y - point.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < settings.nodeSize * 2) {
        setHoveredNode(node)
        found = true
        break
      }
    }

    if (!found) {
      setHoveredNode(null)
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    canvasRef.current?.style.removeProperty('cursor')
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5)

    setPan({
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom),
    })
    setZoom(newZoom)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isPanning) return

    const point = getCanvasPoint(e)
    for (const node of nodes) {
      const dx = node.x - point.x
      const dy = node.y - point.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < settings.nodeSize * 2) {
        setSelectedNode(node)
        return
      }
    }
    setSelectedNode(null)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e)
    for (const node of nodes) {
      const dx = node.x - point.x
      const dy = node.y - point.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < settings.nodeSize * 2) {
        window.location.href = `/workspace/pages/${node.page.id}`
        return
      }
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setMatchedNodes([])
      setShowSearch(false)
      return
    }

    const matches = nodes.filter(n =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      n.page.title.toLowerCase().includes(query.toLowerCase())
    )
    setMatchedNodes(matches)
    setShowSearch(true)
  }

  const selectSearchResult = (node: GraphNode) => {
    setSelectedNode(node)
    setShowSearch(false)
    setSearchQuery('')
    const canvas = canvasRef.current
    if (canvas) {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      setPan({
        x: width / 2 - node.x * zoom,
        y: height / 2 - node.y * zoom,
      })
    }
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const refreshGraph = () => {
    const { nodes: newNodes, links: newLinks } = buildGraphData(pagesData)
    setNodes(newNodes)
    setLinks(newLinks)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowSearch(false)
        setSelectedNode(null)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.getElementById('graph-search') as HTMLInputElement
        searchInput?.focus()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between gap-4">
          <Link
            href="/workspace"
            className="synapse-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Workspace
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 text-center">
            Graph View
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshGraph}
              className="synapse-button-secondary p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Refresh graph"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="synapse-button-secondary p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Graph settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative" id="graph-container">
        <canvas
          ref={canvasRef}
          id="graph-canvas"
          className="w-full h-full cursor-grab"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        />

        <div
          id="graph-info"
          className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-800 z-10 pointer-events-none"
        >
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Graph View</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div id="node-count">{nodes.length} nodes</div>
            <div id="edge-count">{links.length} edges</div>
            <div id="zoom-level">{Math.round(zoom * 100)}%</div>
          </div>
        </div>

        {hoveredNode && !selectedNode && (
          <div
            id="node-tooltip"
            className="absolute bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-xl z-20 pointer-events-none max-w-xs"
            style={{
              left: hoveredNode.x * zoom + pan.x + 20,
              top: hoveredNode.y * zoom + pan.y - 80,
            }}
          >
            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {hoveredNode.page.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {hoveredNode.page.content.slice(0, 100)}...
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setSelectedNode(hoveredNode)}
                className="text-xs text-[#6E56CF] hover:underline"
              >
                Open
              </button>
            </div>
          </div>
        )}

        {showSettings && (
          <div
            id="settings-panel"
            className="absolute top-16 right-4 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-4 z-30"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
              Graph Settings
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Minimize2 className="w-4 h-4" />
              </button>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Layout</label>
                <select
                  value={settings.layout}
                  onChange={(e) => setSettings(s => ({ ...s, layout: e.target.value as any }))}
                  className="synapse-input w-full text-sm"
                >
                  <option value="force">Force-directed</option>
                  <option value="circular">Circular</option>
                  <option value="radial">Radial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Node Size: <span id="node-size-value">{settings.nodeSize}</span>px
                </label>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={settings.nodeSize}
                  onChange={(e) => setSettings(s => ({ ...s, nodeSize: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Link Distance: <span id="link-distance-value">{settings.linkDistance}</span>px
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={settings.linkDistance}
                  onChange={(e) => setSettings(s => ({ ...s, linkDistance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Repulsion: <span id="repulsion-value">{settings.repulsion}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={settings.repulsion}
                  onChange={(e) => setSettings(s => ({ ...s, repulsion: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Center Gravity: <span id="center-gravity-value">{settings.centerGravity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={settings.centerGravity}
                  onChange={(e) => setSettings(s => ({ ...s, centerGravity: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-labels"
                  checked={settings.showLabels}
                  onChange={(e) => setSettings(s => ({ ...s, showLabels: e.target.checked }))}
                  className="w-4 h-4 accent-[#6E56CF] rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="show-labels">
                  Show Labels
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-clusters"
                  checked={settings.showClusters}
                  onChange={(e) => setSettings(s => ({ ...s, showClusters: e.target.checked }))}
                  className="w-4 h-4 accent-[#6E56CF] rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="show-clusters">
                  Color by Folder
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="physics-enabled"
                  checked={settings.physicsEnabled}
                  onChange={(e) => setSettings(s => ({ ...s, physicsEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#6E56CF] rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="physics-enabled">
                  Enable Physics
                </label>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={resetView}
                  className="synapse-button-secondary w-full text-sm flex items-center justify-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  Reset View
                </button>
              </div>
            </div>
          </div>
        )}

        {showSearch && (
          <div
            id="search-panel"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="synapse-card p-2 flex items-center gap-2 min-w-[300px] max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="graph-search"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent border-0 w-full focus:ring-0 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            {matchedNodes.length > 0 && (
              <div className="synapse-card mt-2 max-h-60 overflow-y-auto min-w-[300px] max-w-md">
                {matchedNodes.slice(0, 10).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => selectSearchResult(node)}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{node.page.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}