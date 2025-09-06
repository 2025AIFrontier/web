import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Job {
  id: number
  image: any
  name: string
  position: string
  department: string
  company: string
  link: string
  contact: string
  email: string
  products: string
  type: string
  fav: boolean
}

interface ContactGraphViewProps {
  jobs: Job[]
}

interface NodeData {
  id: string
  label: string
  type: 'company' | 'department' | 'employee'
  email?: string
  job?: Job
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface LinkData {
  source: string | NodeData
  target: string | NodeData
  id: string
}

const ContactGraphView: React.FC<ContactGraphViewProps> = ({
  jobs
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null)
  
  // Node info panel state
  const [selectedNode, setSelectedNode] = useState<{
    id: string
    type: string
    label: string
    email?: string
    job?: Job
  } | null>(null)

  // Advanced filtering state
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set())
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set())
  
  // Layout options state
  const [currentLayout, setCurrentLayout] = useState<string>('force')
  
  // Get unique departments and companies from jobs
  const departments = [...new Set(jobs.map(job => job.department).filter(Boolean))]
  const companies = [...new Set(jobs.map(job => job.company).filter(Boolean))]

  // Node styling constants (base sizes - will be adjusted by connection count)
  const nodeStyles = {
    company: { baseRadius: 8, color: '#dc2626', textColor: '#1f2937', fontSize: 14, fontWeight: 'bold' },
    department: { baseRadius: 6, color: '#2563eb', textColor: '#1f2937', fontSize: 12, fontWeight: 'bold' },
    employee: { baseRadius: 4, color: '#059669', textColor: '#1f2937', fontSize: 10, fontWeight: 'normal' }
  }

  // Function to calculate node radius based on connection count
  const getNodeRadius = (nodeData: NodeData, connectionCount: number) => {
    const baseRadius = nodeStyles[nodeData.type].baseRadius
    // Scale radius based on connections (min 1x, max 3x base size)
    const scaleFactor = 1 + Math.min(connectionCount * 0.2, 2)
    return baseRadius * scaleFactor
  }

  useEffect(() => {
    if (!svgRef.current || jobs.length === 0) return

    // Filter jobs based on advanced filters
    const filteredJobs = jobs.filter(job => {
      const matchesDepartment = selectedDepartments.size === 0 || 
        (job.department && selectedDepartments.has(job.department))
      
      const matchesCompany = selectedCompanies.size === 0 || 
        (job.company && selectedCompanies.has(job.company))
      
      return matchesDepartment && matchesCompany
    })

    // Prepare data
    const nodes: NodeData[] = []
    const links: LinkData[] = []
    const departmentSet = new Set<string>()
    const companySet = new Set<string>()

    // Collect unique departments and companies
    filteredJobs.forEach(job => {
      if (job.department) departmentSet.add(job.department)
      if (job.company) companySet.add(job.company)
    })

    // Create company nodes
    companySet.forEach(company => {
      nodes.push({
        id: `company-${company}`,
        label: company,
        type: 'company'
      })
    })

    // Create department nodes
    departmentSet.forEach(dept => {
      nodes.push({
        id: `dept-${dept}`,
        label: dept,
        type: 'department'
      })
    })

    // Create employee nodes and links
    filteredJobs.forEach(job => {
      nodes.push({
        id: `emp-${job.id}`,
        label: job.name || '',
        email: job.email,
        type: 'employee',
        job
      })

      // Link employee to department
      if (job.department) {
        links.push({
          source: `emp-${job.id}`,
          target: `dept-${job.department}`,
          id: `link-emp-dept-${job.id}`
        })
      }

      // Link department to company
      if (job.department && job.company) {
        const linkId = `link-dept-comp-${job.department}-${job.company}`
        if (!links.find(link => link.id === linkId)) {
          links.push({
            source: `dept-${job.department}`,
            target: `company-${job.company}`,
            id: linkId
          })
        }
      }
    })

    // Set up SVG
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 600
    
    svg.attr("width", width).attr("height", height)

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString())
      })

    svg.call(zoom)

    const g = svg.append("g")

    // Calculate connection counts for each node
    const connectionCounts = new Map<string, number>()
    nodes.forEach(node => {
      const count = links.filter(link => 
        (typeof link.source === 'string' ? link.source : link.source.id) === node.id ||
        (typeof link.target === 'string' ? link.target : link.target.id) === node.id
      ).length
      connectionCounts.set(node.id, count)
    })

    // Create simulation with reduced repulsion
    const simulation = d3.forceSimulation<NodeData, LinkData>(nodes)
      .force("link", d3.forceLink<NodeData, LinkData>(links)
        .id(d => d.id)
        .distance(d => {
          const sourceType = typeof d.source === 'object' ? d.source.type : 'employee'
          const targetType = typeof d.target === 'object' ? d.target.type : 'employee'
          if ((sourceType === 'department' && targetType === 'company') || 
              (sourceType === 'company' && targetType === 'department')) return 150
          if ((sourceType === 'employee' && targetType === 'department') || 
              (sourceType === 'department' && targetType === 'employee')) return 100
          return 120
        }))
      .force("charge", d3.forceManyBody()
        .strength(d => {
          // Reduced repulsion force
          const nodeData = d as NodeData
          if (nodeData.type === 'company') return -1500
          if (nodeData.type === 'department') return -1000
          return -500
        }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide()
        .radius(d => {
          // Increase collision radius to account for text labels and dynamic sizing
          const nodeData = d as NodeData
          const connectionCount = connectionCounts.get(nodeData.id) || 0
          const nodeRadius = getNodeRadius(nodeData, connectionCount)
          const textLength = nodeData.label.length * nodeStyles[nodeData.type].fontSize * 0.6
          return Math.max(nodeRadius + textLength + 10, 30)
        }))

    simulationRef.current = simulation

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#d1d5db")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)

    // Create drag behavior
    const dragBehavior = d3.drag<SVGGElement, NodeData>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on("drag", (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .style("cursor", "pointer")
      .call(dragBehavior)

    // Add circles to nodes (small dots with dynamic sizing)
    node.append("circle")
      .attr("r", d => {
        const connectionCount = connectionCounts.get(d.id) || 0
        return getNodeRadius(d, connectionCount)
      })
      .attr("fill", d => nodeStyles[d.type].color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))")

    // Add labels to nodes (positioned next to dots, clickable and draggable)
    const textElements = node.append("text")
      .text(d => d.label)
      .attr("x", d => {
        const connectionCount = connectionCounts.get(d.id) || 0
        return getNodeRadius(d, connectionCount) + 6 // Position text to the right of the dot
      })
      .attr("y", 0)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("font-size", d => nodeStyles[d.type].fontSize)
      .attr("font-weight", d => nodeStyles[d.type].fontWeight)
      .attr("fill", d => nodeStyles[d.type].textColor)
      .style("pointer-events", "all") // Make text clickable
      .style("user-select", "none")
      .style("font-family", "system-ui, -apple-system, sans-serif")
      .style("cursor", "pointer") // Show pointer cursor on text
    
    // Add drag behavior to text elements
    textElements.call(d3.drag<SVGTextElement, NodeData>()
      .on("start", function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
        // Add visual feedback for text drag
        d3.select(this).style("fill", "#666")
      })
      .on("drag", function(event, d) {
        d.fx = event.x
        d.fy = event.y
      })
      .on("end", function(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
        // Reset text color
        d3.select(this).style("fill", nodeStyles[d.type].textColor)
      }))

    // Add hover effects
    node
      .on("mouseover", function(_, d) {
        const connectionCount = connectionCounts.get(d.id) || 0
        const currentRadius = getNodeRadius(d, connectionCount)
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", currentRadius * 1.5)
          .attr("stroke-width", 2)
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-weight", "bold")
          .attr("font-size", nodeStyles[d.type].fontSize * 1.1)
        
        // Highlight connected elements
        const connectedLinks = links.filter(l => 
          (typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
          (typeof l.target === 'object' ? l.target.id : l.target) === d.id
        )
        
        const connectedNodeIds = new Set([d.id])
        connectedLinks.forEach(l => {
          connectedNodeIds.add(typeof l.source === 'object' ? l.source.id : l.source)
          connectedNodeIds.add(typeof l.target === 'object' ? l.target.id : l.target)
        })
        
        // Fade non-connected elements
        node.style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.3)
        link.style("opacity", l => 
          connectedLinks.includes(l) ? 0.8 : 0.1
        )
      })
      .on("mouseout", function(_, d) {
        const connectionCount = connectionCounts.get(d.id) || 0
        const currentRadius = getNodeRadius(d, connectionCount)
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", currentRadius)
          .attr("stroke-width", 1)
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-weight", nodeStyles[d.type].fontWeight)
          .attr("font-size", nodeStyles[d.type].fontSize)
        
        // Reset opacity
        node.style("opacity", 1)
        link.style("opacity", 0.6)
      })
      .on("click", (_, d) => {
        setSelectedNode({
          id: d.id,
          type: d.type,
          label: d.label,
          email: d.email,
          job: d.job
        })
      })
      .on("dblclick", (_, d) => {
        // Zoom to node and its connections
        const connectedNodes = nodes.filter(n => {
          if (n.id === d.id) return true
          return links.some(l => 
            ((typeof l.source === 'object' ? l.source.id : l.source) === d.id && 
             (typeof l.target === 'object' ? l.target.id : l.target) === n.id) ||
            ((typeof l.target === 'object' ? l.target.id : l.target) === d.id && 
             (typeof l.source === 'object' ? l.source.id : l.source) === n.id)
          )
        })
        
        if (connectedNodes.length > 0) {
          const bounds = {
            x: d3.min(connectedNodes, n => n.x || 0) || 0,
            y: d3.min(connectedNodes, n => n.y || 0) || 0,
            width: (d3.max(connectedNodes, n => n.x || 0) || 0) - (d3.min(connectedNodes, n => n.x || 0) || 0),
            height: (d3.max(connectedNodes, n => n.y || 0) || 0) - (d3.min(connectedNodes, n => n.y || 0) || 0)
          }
          
          const fullWidth = bounds.width + 200
          const fullHeight = bounds.height + 200
          const midX = bounds.x + bounds.width / 2
          const midY = bounds.y + bounds.height / 2
          
          const scale = Math.min(width / fullWidth, height / fullHeight, 2)
          const translate = [width / 2 - scale * midX, height / 2 - scale * midY]
          
          svg.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
        }
      })

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (typeof d.source === 'object' ? d.source.x : 0) || 0)
        .attr("y1", d => (typeof d.source === 'object' ? d.source.y : 0) || 0)
        .attr("x2", d => (typeof d.target === 'object' ? d.target.x : 0) || 0)
        .attr("y2", d => (typeof d.target === 'object' ? d.target.y : 0) || 0)

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`)
    })

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }

  }, [jobs, selectedDepartments, selectedCompanies, currentLayout])

  // Layout change function
  const changeLayout = (layoutName: string) => {
    setCurrentLayout(layoutName)
    
    if (!simulationRef.current) return
    
    const simulation = simulationRef.current
    
    switch (layoutName) {
      case 'force':
        // Default force layout (already implemented)
        simulation.alpha(1).restart()
        break
      case 'circle':
        // Arrange nodes in circles by type
        const nodes = simulation.nodes()
        const companies = nodes.filter(n => n.type === 'company')
        const departments = nodes.filter(n => n.type === 'department')
        const employees = nodes.filter(n => n.type === 'employee')
        
        // Position companies in outer circle
        companies.forEach((node, i) => {
          const angle = (i / companies.length) * 2 * Math.PI
          node.fx = 400 + 200 * Math.cos(angle)
          node.fy = 300 + 200 * Math.sin(angle)
        })
        
        // Position departments in middle circle
        departments.forEach((node, i) => {
          const angle = (i / departments.length) * 2 * Math.PI
          node.fx = 400 + 120 * Math.cos(angle)
          node.fy = 300 + 120 * Math.sin(angle)
        })
        
        // Position employees in inner circle
        employees.forEach((node, i) => {
          const angle = (i / employees.length) * 2 * Math.PI
          node.fx = 400 + 60 * Math.cos(angle)
          node.fy = 300 + 60 * Math.sin(angle)
        })
        
        simulation.alpha(0.3).restart()
        
        // Release fixed positions after animation
        setTimeout(() => {
          nodes.forEach(node => {
            node.fx = null
            node.fy = null
          })
        }, 2000)
        break
        
      case 'hierarchical':
        // Arrange in hierarchy: companies at top, departments in middle, employees at bottom
        const allNodes = simulation.nodes()
        const companyNodes = allNodes.filter(n => n.type === 'company')
        const departmentNodes = allNodes.filter(n => n.type === 'department')
        const employeeNodes = allNodes.filter(n => n.type === 'employee')
        
        companyNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, companyNodes.length - 1))
          node.fy = 100
        })
        
        departmentNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, departmentNodes.length - 1))
          node.fy = 300
        })
        
        employeeNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, employeeNodes.length - 1))
          node.fy = 500
        })
        
        simulation.alpha(0.3).restart()
        
        setTimeout(() => {
          allNodes.forEach(node => {
            node.fx = null
            node.fy = null
          })
        }, 2000)
        break
    }
  }

  // Node info panel component
  const NodeInfoPanel = () => {
    if (!selectedNode) return null

    return (
      <div className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">노드 정보</h3>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {selectedNode.type === 'employee' && selectedNode.job ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <svg className="text-green-600 dark:text-green-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedNode.job.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">직원</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {selectedNode.job.position && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">직급</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.position}</span>
                  </div>
                )}
                
                {selectedNode.job.email && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">이메일</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.email}</span>
                  </div>
                )}
                
                {selectedNode.job.contact && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">연락처</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.contact}</span>
                  </div>
                )}
                
                {selectedNode.job.department && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">부서</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.department}</span>
                  </div>
                )}
                
                {selectedNode.job.company && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">회사</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.company}</span>
                  </div>
                )}
                
                {selectedNode.job.products && (
                  <div className="flex items-center gap-3 p-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">담당제품</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedNode.job.products}</span>
                  </div>
                )}
              </div>
            </>
          ) : selectedNode.type === 'department' ? (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <svg className="text-blue-600 dark:text-blue-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedNode.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">부서</div>
              </div>
            </div>
          ) : selectedNode.type === 'company' ? (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <svg className="text-red-600 dark:text-red-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedNode.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">회사</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <NodeInfoPanel />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">조직도 그래프</h2>
              <p className="text-gray-600 dark:text-gray-400">총 {jobs.length}명의 담당자 관계도</p>
            </div>
            <div className="flex gap-2">
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  레이아웃
                </button>
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {[
                    { key: 'force', name: 'Force 레이아웃' },
                    { key: 'circle', name: '원형 레이아웃' },
                    { key: 'hierarchical', name: '계층형 레이아웃' }
                  ].map((layout, index, array) => (
                    <button
                      key={layout.key}
                      onClick={() => changeLayout(layout.key)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                        currentLayout === layout.key 
                          ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${
                        index === 0 ? 'rounded-t-lg' : 
                        index === array.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      {layout.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              고급 필터
              <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilters && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                {/* Department Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">부서별 필터</h4>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          const newSelected = new Set(selectedDepartments)
                          if (newSelected.has(dept)) {
                            newSelected.delete(dept)
                          } else {
                            newSelected.add(dept)
                          }
                          setSelectedDepartments(newSelected)
                        }}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedDepartments.has(dept)
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        } border`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                  {selectedDepartments.size > 0 && (
                    <button
                      onClick={() => setSelectedDepartments(new Set())}
                      className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      모든 부서 선택 해제
                    </button>
                  )}
                </div>
                
                {/* Company Filter */}
                {companies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">회사별 필터</h4>
                    <div className="flex flex-wrap gap-2">
                      {companies.map(company => (
                        <button
                          key={company}
                          onClick={() => {
                            const newSelected = new Set(selectedCompanies)
                            if (newSelected.has(company)) {
                              newSelected.delete(company)
                            } else {
                              newSelected.add(company)
                            }
                            setSelectedCompanies(newSelected)
                          }}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            selectedCompanies.has(company)
                              ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } border`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                    {selectedCompanies.size > 0 && (
                      <button
                        onClick={() => setSelectedCompanies(new Set())}
                        className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        모든 회사 선택 해제
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">회사</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">부서</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">직원</span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              <div>• 노드 클릭: 상세 정보</div>
              <div>• 드래그: 위치 조정</div>
              <div>• 더블클릭: 확대</div>
              <div>• 휠: 줌</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 relative flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          {jobs.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="text-lg mb-2">📊</div>
              <div>표시할 직원 정보가 없습니다</div>
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-[600px]"></svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactGraphView