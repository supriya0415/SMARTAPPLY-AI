import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CareerNode, CareerEdge } from '../lib/types';

interface FlowChartProps {
  nodes: CareerNode[];
  edges: CareerEdge[];
  className?: string;
  height?: string | number;
}

// Enhanced node positioning with better spacing
const calculateNodePositions = (nodes: CareerNode[]): CareerNode[] => {
  const horizontalSpacing = 400;
  const verticalSpacing = 250;
  
  // Group nodes by type
  const nodesByType = {
    course: nodes.filter(n => n.type === 'course'),
    internship: nodes.filter(n => n.type === 'internship'),
    job: nodes.filter(n => n.type === 'job'),
    company: nodes.filter(n => n.type === 'company'),
    skill: nodes.filter(n => n.type === 'skill'),
    certification: nodes.filter(n => n.type === 'certification'),
  };
  
  const updatedNodes = [...nodes];
  const maxNodesInRow = Math.max(...Object.values(nodesByType).map(arr => arr.length));
  const totalWidth = maxNodesInRow * horizontalSpacing;
  const startX = Math.max(100, (1200 - totalWidth) / 2);
  
  let currentY = 100;
  
  // Layout courses at the top
  nodesByType.course.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: startX + (index * horizontalSpacing), y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Layout internships
  nodesByType.internship.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: startX + (index * horizontalSpacing), y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Layout jobs
  nodesByType.job.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: startX + (index * horizontalSpacing), y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Layout companies
  nodesByType.company.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: startX + (index * horizontalSpacing), y: currentY }
      };
    }
  });
  
  // Layout skills on the right side
  const skillsX = startX + totalWidth + 150;
  nodesByType.skill.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: skillsX, y: 100 + (index * 180) }
      };
    }
  });
  
  return updatedNodes;
};

const nodeTypes: NodeTypes = {
  course: ({ data }) => (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-2xl p-5 min-w-[280px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-600 border-3 border-white shadow-lg" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-blue-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          📚
        </div>
        <div className="font-bold text-gray-900 text-lg">{data?.title || 'Professional Skills'}</div>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed mb-3">{data?.description || 'Develop core professional skills'}</div>
      <div className="flex flex-wrap gap-2">
        {data?.duration && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow">
            ⏱️ {data.duration}
          </span>
        )}
        {data?.difficulty && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow">
            📊 {data.difficulty}
          </span>
        )}
      </div>
    </div>
  ),
  internship: ({ data }) => (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-2xl p-5 min-w-[280px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-purple-600 border-3 border-white shadow-lg" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-purple-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          💼
        </div>
        <div className="font-bold text-gray-900 text-lg">{data?.title || 'Internship'}</div>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed mb-3">{data?.description || 'Gain practical experience'}</div>
      <div className="flex flex-wrap gap-2">
        {data?.duration && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full shadow">
            ⏱️ {data.duration}
          </span>
        )}
      </div>
    </div>
  ),
  job: ({ data }) => (
    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-2xl p-5 min-w-[280px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-green-600 border-3 border-white shadow-lg" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-green-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          🎯
        </div>
        <div className="font-bold text-gray-900 text-lg">{data?.title || 'Entry Level Position'}</div>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed mb-3">{data?.description || 'Start your career journey'}</div>
      <div className="flex flex-wrap gap-2">
        {data?.salary && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-full shadow">
            💰 {data.salary}
          </span>
        )}
      </div>
    </div>
  ),
  company: ({ data }) => (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-2xl p-5 min-w-[280px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-yellow-600 border-3 border-white shadow-lg" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-yellow-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          🏢
        </div>
        <div className="font-bold text-gray-900 text-lg">{data?.title || 'Company'}</div>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed">{data?.description || 'Target company'}</div>
    </div>
  ),
  skill: ({ data }) => (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-2xl p-4 min-w-[220px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-indigo-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
          ⚡
        </div>
        <div className="font-bold text-gray-900">{data?.title || 'Skill'}</div>
      </div>
      <div className="text-xs text-gray-700 leading-relaxed">{data?.description || 'Key skill'}</div>
    </div>
  ),
  certification: ({ data }) => (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 rounded-2xl p-4 min-w-[220px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-orange-600 border-3 border-white shadow-lg" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-orange-600 border-3 border-white shadow-lg" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
          🏆
        </div>
        <div className="font-bold text-gray-900">{data?.title || 'Certification'}</div>
      </div>
      <div className="text-xs text-gray-700 leading-relaxed">{data?.description || 'Professional certification'}</div>
    </div>
  ),
};

export const FlowChart: React.FC<FlowChartProps> = ({ nodes, edges, className, height = '800px' }) => {
  // Calculate better positions
  const positionedNodes = useMemo(() => {
    return calculateNodePositions(nodes);
  }, [nodes]);
  
  // Convert to ReactFlow format
  const reactFlowNodes = useMemo(() => {
    return positionedNodes.map((node: CareerNode) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node,
    }));
  }, [positionedNodes]);
  
  const [flowNodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  
  // Update nodes when props change
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div 
      className={`${className} relative overflow-hidden rounded-3xl border-2 border-gray-300 shadow-2xl`} 
      style={{ width: '100%', height }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.5,
        }}
        className="bg-gradient-to-br from-gray-50 via-white to-gray-50"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { 
            strokeWidth: 3, 
            stroke: '#6366f1',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
            width: 24,
            height: 24,
          },
        }}
        connectionLineStyle={{ 
          strokeWidth: 3, 
          stroke: '#6366f1',
          strokeDasharray: '8,8',
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        attributionPosition="bottom-left"
      >
        <Controls 
          className="bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-xl shadow-xl"
          position="top-left"
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'course': return '#3b82f6';
              case 'internship': return '#8b5cf6';
              case 'job': return '#10b981';
              case 'company': return '#f59e0b';
              case 'skill': return '#6366f1';
              case 'certification': return '#f97316';
              default: return '#3b82f6';
            }
          }}
          nodeStrokeWidth={4}
          nodeBorderRadius={12}
          className="bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-xl shadow-xl"
          position="bottom-right"
          zoomable
          pannable
        />
        <Background 
          color="#9ca3af" 
          gap={20} 
          size={1.5}
          className="opacity-30"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
};
