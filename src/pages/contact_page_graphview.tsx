import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Search, X, User, Mail, Building, Building2, Calendar, Filter, ChevronDown, Layout } from 'lucide-react';
import { Employee } from '../types/api';

interface ContactPageGraphViewProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  totalCount: number;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
}

interface NodeData {
  id: string;
  label: string;
  type: 'company' | 'department' | 'employee';
  email?: string;
  employee?: Employee;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: string | NodeData;
  target: string | NodeData;
  id: string;
}

const ContactPageGraphView: React.FC<ContactPageGraphViewProps> = ({
  employees,
  loading,
  error,
  searchTerm,
  totalCount,
  onSearchChange,
  onRefresh
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);
  
  // Node info panel state
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    type: string;
    label: string;
    email?: string;
    employee?: Employee;
  } | null>(null);

  // Advanced filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  
  // Layout options state
  const [currentLayout, setCurrentLayout] = useState<string>('force');
  
  // Get unique departments and companies from employees
  const departments = [...new Set(employees.map(emp => emp.department_name).filter(Boolean))];
  const companies = [...new Set(employees.map(emp => emp.company_name).filter(Boolean))];

  // Node styling constants (base sizes - will be adjusted by connection count)
  const nodeStyles = {
    company: { baseRadius: 8, color: '#dc2626', textColor: '#1f2937', fontSize: 14, fontWeight: 'bold' },
    department: { baseRadius: 6, color: '#2563eb', textColor: '#1f2937', fontSize: 12, fontWeight: 'bold' },
    employee: { baseRadius: 4, color: '#059669', textColor: '#1f2937', fontSize: 10, fontWeight: 'normal' }
  };

  // Function to calculate node radius based on connection count
  const getNodeRadius = (nodeData: NodeData, connectionCount: number) => {
    const baseRadius = nodeStyles[nodeData.type].baseRadius;
    // Scale radius based on connections (min 1x, max 3x base size)
    const scaleFactor = 1 + Math.min(connectionCount * 0.2, 2);
    return baseRadius * scaleFactor;
  };

  useEffect(() => {
    if (!svgRef.current || employees.length === 0) return;

    // Filter employees based on search term and advanced filters
    const filteredEmployees = employees.filter(employee => {
      const matchesSearch = !searchTerm || 
        employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartments.size === 0 || 
        (employee.department_name && selectedDepartments.has(employee.department_name));
      
      const matchesCompany = selectedCompanies.size === 0 || 
        (employee.company_name && selectedCompanies.has(employee.company_name));
      
      return matchesSearch && matchesDepartment && matchesCompany;
    });

    // Prepare data
    const nodes: NodeData[] = [];
    const links: LinkData[] = [];
    const departmentSet = new Set<string>();
    const companySet = new Set<string>();

    // Collect unique departments and companies
    filteredEmployees.forEach(employee => {
      if (employee.department_name) departmentSet.add(employee.department_name);
      if (employee.company_name) companySet.add(employee.company_name);
    });

    // Create company nodes
    companySet.forEach(company => {
      nodes.push({
        id: `company-${company}`,
        label: company,
        type: 'company'
      });
    });

    // Create department nodes
    departmentSet.forEach(dept => {
      nodes.push({
        id: `dept-${dept}`,
        label: dept,
        type: 'department'
      });
    });

    // Create employee nodes and links
    filteredEmployees.forEach(employee => {
      nodes.push({
        id: `emp-${employee.id}`,
        label: employee.full_name || '',
        email: employee.email_address,
        type: 'employee',
        employee
      });

      // Link employee to department
      if (employee.department_name) {
        links.push({
          source: `emp-${employee.id}`,
          target: `dept-${employee.department_name}`,
          id: `link-emp-dept-${employee.id}`
        });
      }

      // Link department to company
      if (employee.department_name && employee.company_name) {
        const linkId = `link-dept-comp-${employee.department_name}-${employee.company_name}`;
        if (!links.find(link => link.id === linkId)) {
          links.push({
            source: `dept-${employee.department_name}`,
            target: `company-${employee.company_name}`,
            id: linkId
          });
        }
      }
    });

    // Set up SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Calculate connection counts for each node
    const connectionCounts = new Map<string, number>();
    nodes.forEach(node => {
      const count = links.filter(link => 
        (typeof link.source === 'string' ? link.source : link.source.id) === node.id ||
        (typeof link.target === 'string' ? link.target : link.target.id) === node.id
      ).length;
      connectionCounts.set(node.id, count);
    });

    // Create simulation with reduced repulsion
    const simulation = d3.forceSimulation<NodeData, LinkData>(nodes)
      .force("link", d3.forceLink<NodeData, LinkData>(links)
        .id(d => d.id)
        .distance(d => {
          const sourceType = typeof d.source === 'object' ? d.source.type : 'employee';
          const targetType = typeof d.target === 'object' ? d.target.type : 'employee';
          if ((sourceType === 'department' && targetType === 'company') || 
              (sourceType === 'company' && targetType === 'department')) return 150;
          if ((sourceType === 'employee' && targetType === 'department') || 
              (sourceType === 'department' && targetType === 'employee')) return 100;
          return 120;
        }))
      .force("charge", d3.forceManyBody()
        .strength(d => {
          // Reduced repulsion force
          const nodeData = d as NodeData;
          if (nodeData.type === 'company') return -1500;
          if (nodeData.type === 'department') return -1000;
          return -500;
        }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide()
        .radius(d => {
          // Increase collision radius to account for text labels and dynamic sizing
          const nodeData = d as NodeData;
          const connectionCount = connectionCounts.get(nodeData.id) || 0;
          const nodeRadius = getNodeRadius(nodeData, connectionCount);
          const textLength = nodeData.label.length * nodeStyles[nodeData.type].fontSize * 0.6;
          return Math.max(nodeRadius + textLength + 10, 30);
        }));

    simulationRef.current = simulation;

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#d1d5db")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Create drag behavior
    const dragBehavior = d3.drag<SVGGElement, NodeData>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .style("cursor", "pointer")
      .call(dragBehavior);

    // Add circles to nodes (small dots with dynamic sizing)
    node.append("circle")
      .attr("r", d => {
        const connectionCount = connectionCounts.get(d.id) || 0;
        return getNodeRadius(d, connectionCount);
      })
      .attr("fill", d => nodeStyles[d.type].color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))");

    // Add labels to nodes (positioned next to dots, clickable and draggable)
    const textElements = node.append("text")
      .text(d => d.label)
      .attr("x", d => {
        const connectionCount = connectionCounts.get(d.id) || 0;
        return getNodeRadius(d, connectionCount) + 6; // Position text to the right of the dot
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
      .style("cursor", "pointer"); // Show pointer cursor on text
    
    // Add drag behavior to text elements
    textElements.call(d3.drag<SVGTextElement, NodeData>()
      .on("start", function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // Add visual feedback for text drag
        d3.select(this).style("fill", "#666");
      })
      .on("drag", function(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", function(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // Reset text color
        d3.select(this).style("fill", nodeStyles[d.type].textColor);
      }));

    // Add hover effects
    node
      .on("mouseover", function(_, d) {
        const connectionCount = connectionCounts.get(d.id) || 0;
        const currentRadius = getNodeRadius(d, connectionCount);
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", currentRadius * 1.5)
          .attr("stroke-width", 2);
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-weight", "bold")
          .attr("font-size", nodeStyles[d.type].fontSize * 1.1);
        
        // Highlight connected elements
        const connectedLinks = links.filter(l => 
          (typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
          (typeof l.target === 'object' ? l.target.id : l.target) === d.id
        );
        
        const connectedNodeIds = new Set([d.id]);
        connectedLinks.forEach(l => {
          connectedNodeIds.add(typeof l.source === 'object' ? l.source.id : l.source);
          connectedNodeIds.add(typeof l.target === 'object' ? l.target.id : l.target);
        });
        
        // Fade non-connected elements
        node.style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.3);
        link.style("opacity", l => 
          connectedLinks.includes(l) ? 0.8 : 0.1
        );
      })
      .on("mouseout", function(_, d) {
        const connectionCount = connectionCounts.get(d.id) || 0;
        const currentRadius = getNodeRadius(d, connectionCount);
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", currentRadius)
          .attr("stroke-width", 1);
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-weight", nodeStyles[d.type].fontWeight)
          .attr("font-size", nodeStyles[d.type].fontSize);
        
        // Reset opacity
        node.style("opacity", 1);
        link.style("opacity", 0.6);
      })
      .on("click", (_, d) => {
        setSelectedNode({
          id: d.id,
          type: d.type,
          label: d.label,
          email: d.email,
          employee: d.employee
        });
      })
      .on("dblclick", (_, d) => {
        // Zoom to node and its connections
        const connectedNodes = nodes.filter(n => {
          if (n.id === d.id) return true;
          return links.some(l => 
            ((typeof l.source === 'object' ? l.source.id : l.source) === d.id && 
             (typeof l.target === 'object' ? l.target.id : l.target) === n.id) ||
            ((typeof l.target === 'object' ? l.target.id : l.target) === d.id && 
             (typeof l.source === 'object' ? l.source.id : l.source) === n.id)
          );
        });
        
        if (connectedNodes.length > 0) {
          const bounds = {
            x: d3.min(connectedNodes, n => n.x || 0) || 0,
            y: d3.min(connectedNodes, n => n.y || 0) || 0,
            width: (d3.max(connectedNodes, n => n.x || 0) || 0) - (d3.min(connectedNodes, n => n.x || 0) || 0),
            height: (d3.max(connectedNodes, n => n.y || 0) || 0) - (d3.min(connectedNodes, n => n.y || 0) || 0)
          };
          
          const fullWidth = bounds.width + 200;
          const fullHeight = bounds.height + 200;
          const midX = bounds.x + bounds.width / 2;
          const midY = bounds.y + bounds.height / 2;
          
          const scale = Math.min(width / fullWidth, height / fullHeight, 2);
          const translate = [width / 2 - scale * midX, height / 2 - scale * midY];
          
          svg.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
        }
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (typeof d.source === 'object' ? d.source.x : 0) || 0)
        .attr("y1", d => (typeof d.source === 'object' ? d.source.y : 0) || 0)
        .attr("x2", d => (typeof d.target === 'object' ? d.target.x : 0) || 0)
        .attr("y2", d => (typeof d.target === 'object' ? d.target.y : 0) || 0);

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };

  }, [employees, searchTerm, selectedDepartments, selectedCompanies, currentLayout]);

  // Layout change function
  const changeLayout = (layoutName: string) => {
    setCurrentLayout(layoutName);
    
    if (!simulationRef.current) return;
    
    const simulation = simulationRef.current;
    
    switch (layoutName) {
      case 'force':
        // Default force layout (already implemented)
        simulation.alpha(1).restart();
        break;
      case 'circle':
        // Arrange nodes in circles by type
        const nodes = simulation.nodes();
        const companies = nodes.filter(n => n.type === 'company');
        const departments = nodes.filter(n => n.type === 'department');
        const employees = nodes.filter(n => n.type === 'employee');
        
        // Position companies in outer circle
        companies.forEach((node, i) => {
          const angle = (i / companies.length) * 2 * Math.PI;
          node.fx = 400 + 200 * Math.cos(angle);
          node.fy = 300 + 200 * Math.sin(angle);
        });
        
        // Position departments in middle circle
        departments.forEach((node, i) => {
          const angle = (i / departments.length) * 2 * Math.PI;
          node.fx = 400 + 120 * Math.cos(angle);
          node.fy = 300 + 120 * Math.sin(angle);
        });
        
        // Position employees in inner circle
        employees.forEach((node, i) => {
          const angle = (i / employees.length) * 2 * Math.PI;
          node.fx = 400 + 60 * Math.cos(angle);
          node.fy = 300 + 60 * Math.sin(angle);
        });
        
        simulation.alpha(0.3).restart();
        
        // Release fixed positions after animation
        setTimeout(() => {
          nodes.forEach(node => {
            node.fx = null;
            node.fy = null;
          });
        }, 2000);
        break;
        
      case 'hierarchical':
        // Arrange in hierarchy: companies at top, departments in middle, employees at bottom
        const allNodes = simulation.nodes();
        const companyNodes = allNodes.filter(n => n.type === 'company');
        const departmentNodes = allNodes.filter(n => n.type === 'department');
        const employeeNodes = allNodes.filter(n => n.type === 'employee');
        
        companyNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, companyNodes.length - 1));
          node.fy = 100;
        });
        
        departmentNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, departmentNodes.length - 1));
          node.fy = 300;
        });
        
        employeeNodes.forEach((node, i) => {
          node.fx = 100 + (i * 600 / Math.max(1, employeeNodes.length - 1));
          node.fy = 500;
        });
        
        simulation.alpha(0.3).restart();
        
        setTimeout(() => {
          allNodes.forEach(node => {
            node.fx = null;
            node.fy = null;
          });
        }, 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // Node info panel component
  const NodeInfoPanel = () => {
    if (!selectedNode) return null;

    return (
      <div className="fixed top-4 right-4 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">노드 정보</h3>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {selectedNode.type === 'employee' && selectedNode.employee ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <User className="text-green-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-800">{selectedNode.employee.full_name}</div>
                  <div className="text-sm text-gray-600">직원</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {selectedNode.employee.email_address && (
                  <div className="flex items-center gap-3 p-2">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-700">{selectedNode.employee.email_address}</span>
                  </div>
                )}
                
                
                {selectedNode.employee.department_name && (
                  <div className="flex items-center gap-3 p-2">
                    <Building className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-700">{selectedNode.employee.department_name}</span>
                  </div>
                )}
                
                {selectedNode.employee.company_name && (
                  <div className="flex items-center gap-3 p-2">
                    <Building2 className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-700">{selectedNode.employee.company_name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-2">
                  <Calendar className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-700">
                    업데이트: {new Date(selectedNode.employee.updated_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </>
          ) : selectedNode.type === 'department' ? (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Building className="text-blue-600" size={24} />
              <div>
                <div className="font-semibold text-gray-800">{selectedNode.label}</div>
                <div className="text-sm text-gray-600">부서</div>
              </div>
            </div>
          ) : selectedNode.type === 'company' ? (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <Building2 className="text-red-600" size={24} />
              <div>
                <div className="font-semibold text-gray-800">{selectedNode.label}</div>
                <div className="text-sm text-gray-600">회사</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <NodeInfoPanel />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">조직도 그래프 (D3.js)</h2>
              <p className="text-gray-600">총 {totalCount}명의 담당자 관계도</p>
            </div>
            <div className="flex gap-2">
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Layout className="w-4 h-4" />
                  레이아웃
                </button>
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
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
                          ? 'bg-purple-50 text-purple-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
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
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="이름, 이메일, 부서로 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="검색어 지우기"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Advanced Filters */}
          <div className="mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter size={16} />
              고급 필터
              <ChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
            
            {showFilters && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border space-y-4">
                {/* Department Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">부서별 필터</h4>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          const newSelected = new Set(selectedDepartments);
                          if (newSelected.has(dept)) {
                            newSelected.delete(dept);
                          } else {
                            newSelected.add(dept);
                          }
                          setSelectedDepartments(newSelected);
                        }}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedDepartments.has(dept)
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        } border`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                  {selectedDepartments.size > 0 && (
                    <button
                      onClick={() => setSelectedDepartments(new Set())}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      모든 부서 선택 해제
                    </button>
                  )}
                </div>
                
                {/* Company Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">회사별 필터</h4>
                  <div className="flex flex-wrap gap-2">
                    {companies.map(company => (
                      <button
                        key={company}
                        onClick={() => {
                          const newSelected = new Set(selectedCompanies);
                          if (newSelected.has(company)) {
                            newSelected.delete(company);
                          } else {
                            newSelected.add(company);
                          }
                          setSelectedCompanies(newSelected);
                        }}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedCompanies.has(company)
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        } border`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                  {selectedCompanies.size > 0 && (
                    <button
                      onClick={() => setSelectedCompanies(new Set())}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      모든 회사 선택 해제
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
                <span className="font-medium">회사</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                <span className="font-medium">부서</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full shadow-sm"></div>
                <span className="font-medium">직원</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">
              <div>• 노드 클릭: 상세 정보</div>
              <div>• 드래그: 위치 조정</div>
              <div>• 더블클릭: 확대</div>
              <div>• 휠: 줌</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 relative flex items-center justify-center bg-white">
          {employees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-lg mb-2">📊</div>
              <div>데이터를 불러오는 중이거나 표시할 직원 정보가 없습니다</div>
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-[600px]"></svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPageGraphView;